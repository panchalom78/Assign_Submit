using CG.Web.MegaApiClient;
using Microsoft.EntityFrameworkCore;
using Server.Data; // Assuming AppDbContext is here
using Server.Models;
using Server.DTOs;
using System;
using System.IO;
using System.Threading.Tasks;
using Dropbox.Api;
using Dropbox.Api.Files;

namespace Server.Services

{
    public class SubmissionService
    {
        private readonly UserDBContext _context;
        private readonly string _dropboxToken;

        public SubmissionService(UserDBContext context, IConfiguration config)
        {
            _context = context;
            _dropboxToken = config["Dropbox:AccessToken"];
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
            // Inside UploadSubmissionAsync method, replace the try block with:

            try
            {
                // Initialize Appwrite client with proper formatting
                // var client = new Client();
                // client.SetEndpoint("https://fra.cloud.appwrite.io/v1");
                // client.SetProject("687b8d560014af25c5ef");
                // client.SetKey("standard_62253218b6dc8e310a6980094e0da7024c8293e880a5c840c9314a9cb84acff1a531a7d68ec879641739e12471e4f258c8f813847359fe520c495c820a6a770b182ef533b941b851475a196a5e7ab0e0817c0a1ca5c7d027d9ecc2191980d4f5fed8106824222e4201c6e3c74d90ae8b7f76fa7adbfaca4cf66b49d84dbd6b1d");

                // // Verify client initialization
                // if (client == null)
                // {
                //     throw new Exception("Failed to initialize Appwrite client");
                // }

                // var storage = new Storage(client) ?? throw new Exception("Failed to initialize Appwrite storage");

                // Create a temporary file path with unique name
                string tempDirectory = Path.Combine(Directory.GetCurrentDirectory(), "temp");
                Directory.CreateDirectory(tempDirectory);
                string uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                string tempFilePath = Path.Combine(tempDirectory, uniqueFileName);
                using (var stream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                try
                {
                    using (var dbx = new DropboxClient(_dropboxToken))
                    {
                        // ✅ Upload a file
                        using (var fileStream = File.Open(tempFilePath, FileMode.Open))
                        {
                            var uploaded = await dbx.Files.UploadAsync(
                                "/" + uniqueFileName,
                                WriteMode.Overwrite.Instance,
                                body: fileStream
                            );
                            Console.WriteLine($"Uploaded: {uploaded.Name}");
                            filePath = uploaded.Name;
                        }
                    }
                }
                finally
                {
                    // Ensure temporary file is cleaned up even if upload fails
                    if (File.Exists(tempFilePath))
                    {
                        File.Delete(tempFilePath);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
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

            return submission;
        }

        public async Task<(Stream fileStream, string fileName)> DownloadSubmissionAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .FirstOrDefaultAsync(s => s.SubmissionId == submissionId);

            if (submission == null)
                throw new ArgumentException("Submission not found.");

            if (string.IsNullOrEmpty(submission.FilePath))
                throw new ArgumentException("No file associated with this submission.");

            try
            {
                using (var dbx = new DropboxClient(_dropboxToken))
                {
                    // Ensure path starts with "/"
                    string dropboxPath = submission.FilePath.StartsWith("/")
                        ? submission.FilePath
                        : "/" + submission.FilePath;

                    // Download file
                    var response = await dbx.Files.DownloadAsync(dropboxPath);
                    Stream fileStream = await response.GetContentAsStreamAsync();

                    // Extract just the filename
                    string fileName = Path.GetFileName(dropboxPath);

                    return (fileStream, fileName);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to download file from Dropbox: {ex.Message}");
            }
        }


        public async Task<SubmissionResponseDTO> GradeSubmission(int submissionId, int? marks, string? feedback)
        {
            try
            {
                var submission = await _context.Submissions
                    .Include(s => s.Student)
                    .FirstOrDefaultAsync(s => s.SubmissionId == submissionId);

                if (submission == null)
                {
                    throw new Exception("Submission not found");
                }

                // Update submission with grades
                submission.Marks = marks;
                submission.Feedback = feedback;

                await _context.SaveChangesAsync();

                // Return updated submission
                return new SubmissionResponseDTO
                {
                    SubmissionId = submission.SubmissionId,
                    StudentId = submission.StudentId,
                    AssignmentId = submission.AssignmentId,
                    SubmissionDate = submission.SubmissionDate,
                    FilePath = submission.FilePath,
                    Marks = submission.Marks,
                    Feedback = submission.Feedback,
                    StudentName = submission.Student?.FullName
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to grade submission: {ex.Message}");
            }
        }

        public async Task<Submission> ResubmitAssignmentAsync(int remarkId, int studentId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }

            if (!file.ContentType.Equals("application/pdf"))
            {
                throw new ArgumentException("Only PDF files are allowed.");
            }

            // Get the remark and related submission
            var remark = await _context.Remarks
                .Include(r => r.Submission)
                .FirstOrDefaultAsync(r => r.Id == remarkId);

            if (remark == null)
            {
                throw new ArgumentException("Remark not found.");
            }

            if (!remark.ResubmissionRequired)
            {
                throw new ArgumentException("This submission does not require resubmission.");
            }

            if (remark.ResubmissionDeadline.HasValue && DateTime.UtcNow > remark.ResubmissionDeadline.Value)
            {
                throw new ArgumentException("Resubmission deadline has passed.");
            }

            var oldSubmission = remark.Submission;
            if (oldSubmission == null)
            {
                throw new ArgumentException("Original submission not found.");
            }

            if (oldSubmission.StudentId != studentId)
            {
                throw new ArgumentException("You are not authorized to resubmit this assignment.");
            }

            // Save new file to MEGA
            string filePath;
            try
            {
                // Save locally first
                filePath = Path.Combine(Path.GetTempPath(), file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Upload to MEGA
                string megaEmail = "panchalom787@gmail.com";
                string megaPassword = "Ompan@78";
                string megaFileId = await MegaUploader.UploadPdfToMegaAsync(megaEmail, megaPassword, filePath);
                if (megaFileId == null)
                {
                    throw new Exception("Failed to upload file to MEGA.");
                }

                // Delete old file from MEGA if it exists
                if (!string.IsNullOrEmpty(oldSubmission.FilePath))
                {
                    try
                    {
                        var client = new MegaApiClient();
                        await client.LoginAsync(megaEmail, megaPassword);
                        var nodes = await client.GetNodesAsync();
                        var oldFileNode = nodes.FirstOrDefault(n => n.Id == oldSubmission.FilePath);
                        if (oldFileNode != null)
                        {
                            await client.DeleteAsync(oldFileNode);
                        }
                        await client.LogoutAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Failed to delete old file: {ex.Message}");
                    }
                }

                // Update submission
                oldSubmission.FilePath = megaFileId;
                oldSubmission.SubmissionDate = DateTime.UtcNow;
                oldSubmission.Marks = null;
                oldSubmission.Feedback = null;

                // Delete the remark
                _context.Remarks.Remove(remark);

                await _context.SaveChangesAsync();

                // Clean up temp file
                // if (File.Exists(filePath))
                // {
                //     File.Delete(filePath);
                // }

                return oldSubmission;
            }
            catch (Exception ex)
            {
                throw new Exception($"File upload failed: {ex.Message}");
            }
        }
    }
}