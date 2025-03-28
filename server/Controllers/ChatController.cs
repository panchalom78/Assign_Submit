using Microsoft.AspNetCore.Mvc;
using Server.Services;
using Server.DTOs;
using Server.Token;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("groups")]
        public async Task<IActionResult> GetUserChatGroups()
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                    return Unauthorized(new { Error = "Token is required" });

                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null)
                    return Unauthorized(new { Error = "Invalid token" });

                var chatGroups = await _chatService.GetUserChatGroups(decodedToken.UserId);
                return Ok(chatGroups);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("messages/{chatGroupId}")]
        public async Task<IActionResult> GetChatMessages(int chatGroupId)
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                    return Unauthorized(new { Error = "Token is required" });

                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null)
                    return Unauthorized(new { Error = "Invalid token" });

                var messages = await _chatService.GetChatMessages(chatGroupId, decodedToken.UserId);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            try
            {
                var cookie = Request.Cookies["jwt"];
                if (cookie == null)
                    return Unauthorized(new { Error = "Token is required" });

                var decodedToken = TokenService.DecodeToken(cookie);
                if (decodedToken == null)
                    return Unauthorized(new { Error = "Invalid token" });

                var message = await _chatService.SendMessage(request.ChatGroupId, decodedToken.UserId, request.Message);
                return Ok(message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}