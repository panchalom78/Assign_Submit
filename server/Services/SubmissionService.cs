using CG.Web.MegaApiClient;
using Microsoft.EntityFrameworkCore;
using Server.Data; // Assuming AppDbContext is here
using Server.Models;
using Server.DTOs;
using Dropbox.Api;
using Dropbox.Api.Files;
using System.Text.Json;

namespace Server.Services

{
    public class SubmissionService
    {
        private readonly UserDBContext _context;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _refreshToken;
        private string? _cachedAccessToken;
        private DateTime _tokenExpiry;

        public SubmissionService(UserDBContext context, IConfiguration config)
        {
            _context = context;
            _clientId = config["Dropbox:ClientId"] ?? throw new ArgumentNullException("Dropbox:ClientId configuration is missing.");
            _clientSecret = config["Dropbox:ClientSecret"] ?? throw new ArgumentNullException("Dropbox:ClientSecret configuration is missing.");
            _refreshToken = config["Dropbox:RefreshToken"] ?? throw new ArgumentNullException("Dropbox:RefreshToken configuration is missing.");
        }

        private async Task<string> GetValidDropboxTokenAsync()
        {
            if (!string.IsNullOrEmpty(_cachedAccessToken) && DateTime.UtcNow < _tokenExpiry)
            {
                return _cachedAccessToken;
            }

            using var httpClient = new HttpClient();
            var content = new FormUrlEncodedContent(new Dictionary<string, string>
    {
        { "grant_type", "refresh_token" },
        { "refresh_token", _refreshToken },
        { "client_id", _clientId },
        { "client_secret", _clientSecret }
    });

            var response = await httpClient.PostAsync("https://api.dropboxapi.com/oauth2/token", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);

            _cachedAccessToken = data["access_token"].GetString();
            var expiresIn = data["expires_in"].GetInt32();
            _tokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn - 60); // refresh 1 min early

            return _cachedAccessToken!;
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
                    var token = await GetValidDropboxTokenAsync();
                    using (var dbx = new DropboxClient(token))
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
                var token = await GetValidDropboxTokenAsync();
                using (var dbx = new DropboxClient(token))
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