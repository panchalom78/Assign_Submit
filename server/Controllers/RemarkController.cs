using Microsoft.AspNetCore.Mvc;
using Server.Services;
<<<<<<< HEAD
using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Server.Token;
using Server.DTOs;
using System.Security.Claims;
=======
using Microsoft.AspNetCore.Authorization;
using Server.DTOs;
>>>>>>> eaffe57 (changes the sql server link)

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RemarkController : ControllerBase
    {
        private readonly RemarkService _remarkService;
        private readonly AuthService _authService;

        public RemarkController(RemarkService remarkService, AuthService authService)
        {
            _remarkService = remarkService;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRemarks()
        {
            try
            {
                var token = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { Error = "Token not found" });
                }

                var data = await _authService.VerifyToken(token);
                if (data.user.Role != "student")
                {
                    return Unauthorized(new { Error = "Only students can view their remarks" });
                }

                var remarks = await _remarkService.GetRemarksByStudentId(data.user.UserId);
                return Ok(remarks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRemark([FromBody] CreateRemarkRequest request)
        {
            try
            {
                var token = Request.Cookies["jwt"];
                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new { Error = "Token not found" });
                }

                var data = await _authService.VerifyToken(token);
                if (data.user.Role != "teacher")
                {
                    return Unauthorized(new { Error = "Only teachers can create remarks" });
                }

                var remark = _remarkService.CreateRemark(request, data.user.UserId);
                return Ok(remark);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // [HttpGet("submission/{submissionId}")]
        // public IActionResult GetRemarksBySubmissionId(int submissionId)
        // {
        //     try
        //     {
        //         var remarks = _remarkService.GetRemarksBySubmissionId(submissionId);
        //         return Ok(remarks);
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }
    }
}

