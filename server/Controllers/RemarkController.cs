using Microsoft.AspNetCore.Mvc;
using Server.Services;
using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Server.Token;
using Server.DTOs;

namespace Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RemarkController : ControllerBase
    {
        private readonly RemarkService _remarkService;

        public RemarkController(RemarkService remarkService)
        {
            _remarkService = remarkService;
        }

        [HttpGet]
        public IActionResult GetRemarks()
        {
            try
            {
                var remarks = _remarkService.GetRemarks();
                return Ok(remarks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create")]
        public IActionResult CreateRemark([FromBody] CreateRemarkRequest request, int userId)
        {
            try
            {
                var remark = _remarkService.CreateRemark(request, userId);
                return Ok(remark);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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

