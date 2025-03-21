using CG.Web.MegaApiClient;
using Microsoft.EntityFrameworkCore;
using Server.Data; // Assuming AppDbContext is here
using Server.Models;
using System;
using System.IO;
using System.Threading.Tasks;
namespace Server.Services
{
    public class SubmissionService
    {
        private readonly UserDBContext _context;

        public SubmissionService(UserDBContext context)
        {
            _context = context;
        }

        public async Task<Submission> UploadSubmissionAsync(int assignmentId, int studentId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }

            if (!file.ContentType.Equals("application/pdf"))
            {
                throw new ArgumentException("Only PDF files are allowed.");
            }

            // Validate Assignment and Student
            var assignment = await _context.Assignments.FindAsync(assignmentId);
            if (assignment == null)
            {
                throw new ArgumentException("Assignment not found.");
            }

            var student = await _context.Users.FindAsync(studentId);
            if (student == null)
            {
                throw new ArgumentException("Student not found.");
            }

            // Save file (local or MEGA)
            string filePath;
            try
            {
                // Option 1: Save locally (temporary)
                filePath = Path.Combine(Path.GetTempPath(), file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Option 2: Upload to MEGA (uncomment to use)

                string megaEmail = "panchalom787@gmail.com";
                string megaPassword = "Ompan@78";
                string megaFileId = await MegaUploader.UploadPdfToMegaAsync(megaEmail, megaPassword, filePath);
                if (megaFileId == null)
                {
                    throw new Exception("Failed to upload file to MEGA.");
                }
                filePath = megaFileId; // Store MEGA file ID or URL

            }
            catch (Exception ex)
            {
                throw new Exception($"File upload failed: {ex.Message}");
            }

            // Create new submission
            var submission = new Submission
            {
                FilePath = filePath,
                SubmissionDate = DateTime.UtcNow,
                Marks = null,
                Feedback = null,
                AssignmentId = assignmentId,
                StudentId = studentId
            };

            // Save to database
            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            // Clean up temporary file (if not using MEGA)
            if (filePath.StartsWith(Path.GetTempPath()) && File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            return submission;
        }

        public async Task<(Stream fileStream, string fileName)> DownloadSubmissionAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .FirstOrDefaultAsync(s => s.SubmissionId == submissionId);
            if (submission == null)
            {
                throw new ArgumentException("Submission not found.");
            }

            if (string.IsNullOrEmpty(submission.FilePath))
            {
                throw new ArgumentException("No file associated with this submission.");
            }

            var client = new MegaApiClient();
            try
            {
                string megaEmail = "panchalom787@gmail.com";
                string megaPassword = "Ompan@78";
                await client.LoginAsync(megaEmail, megaPassword);

                var nodes = await client.GetNodesAsync();
                var fileNode = nodes.FirstOrDefault(n => n.Id == submission.FilePath && n.Type == NodeType.File);
                if (fileNode == null)
                {
                    throw new ArgumentException("File not found in MEGA.");
                }

                // Download directly to a Stream
                var fileStream = await client.DownloadAsync(fileNode);
                return (fileStream, fileNode.Name);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to download file from MEGA: {ex.Message}");
            }
            finally
            {
                if (client.IsLoggedIn)
                {
                    await client.LogoutAsync();
                }
            }
        }
    }
}