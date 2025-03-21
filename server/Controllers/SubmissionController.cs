using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Services;
using Server.Token;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionService _submissionService;

        public SubmissionController(SubmissionService submissionService)
        {
            _submissionService = submissionService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadSubmission(
            [FromForm] int assignmentId,
            [FromForm] IFormFile file)
        {
            try
            {
                Console.WriteLine($"file {file}");
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "student")
                {
                    return Unauthorized(new { Error = "You are not authorized to create an assignment" });
                }

                var submission = await _submissionService.UploadSubmissionAsync(assignmentId, decodedToken.UserId, file);
                return Ok(new
                {
                    submissionId = submission.SubmissionId,
                    filePath = submission.FilePath,
                    submissionDate = submission.SubmissionDate,
                    assignmentId = submission.AssignmentId,
                    studentId = submission.StudentId,
                    message = "Submission uploaded successfully."
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("download/{submissionId}")]
        public async Task<IActionResult> DownloadSubmission(int submissionId)
        {
            try
            {
                // Validate JWT and role
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                {
                    return Unauthorized(new { Error = "Token is required" });
                }
                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null || decodedToken.Role != "student")
                {
                    return Unauthorized(new { Error = "You are not authorized to download this file" });
                }

                // Download file from service
                var (fileStream, fileName) = await _submissionService.DownloadSubmissionAsync(submissionId);

                // Return file as a downloadable response
                return File(fileStream, "application/pdf", fileName);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}