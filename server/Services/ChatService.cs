using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Services
{
    public class ChatService
    {
        private readonly UserDBContext _context;

        public ChatService(UserDBContext context)
        {
            _context = context;
        }

        public async Task<List<ChatGroupDTO>> GetUserChatGroups(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var query = _context.ChatGroups
                .Include(cg => cg.Assignment)
                .Include(cg => cg.Messages)
                .ThenInclude(m => m.User)
                .AsQueryable();

            // Filter based on user role
            if (user.Role.ToLower() == "student")
            {
                query = query.Where(cg => cg.Assignment.ClassId == user.ClassId);
            }
            else if (user.Role.ToLower() == "teacher")
            {
                query = query.Where(cg => cg.Assignment.UserId == userId);
            }

            var chatGroups = await query
                .Select(cg => new ChatGroupDTO
                {
                    ChatGroupId = cg.ChatGroupId,
                    AssignmentId = cg.AssignmentId,
                    AssignmentTitle = cg.Assignment.Title,
                    ExpiryDate = cg.ExpiryDate,
                    IsActive = cg.IsActive,
                    RecentMessages = cg.Messages
                        .OrderByDescending(m => m.SentAt)
                        .Take(1)
                        .Select(m => new ChatMessageDTO
                        {
                            ChatMessageId = m.ChatMessageId,
                            UserId = m.UserId,
                            UserName = m.User.FullName,
                            Message = m.Message,
                            SentAt = m.SentAt,
                            Role = m.User.Role
                        })
                        .ToList()
                })
                .ToListAsync();

            return chatGroups;
        }

        public async Task<List<ChatMessageDTO>> GetChatMessages(int chatGroupId, int userId)
        {
            var chatGroup = await _context.ChatGroups
                .Include(cg => cg.Messages)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(cg => cg.ChatGroupId == chatGroupId);

            if (chatGroup == null)
                throw new Exception("Chat group not found");

            if (!chatGroup.IsActive)
                throw new Exception("This chat group has expired");

#pragma warning disable CS8601 // Possible null reference assignment.
#pragma warning disable CS8601 // Possible null reference assignment.
            return await _context.ChatMessages
                .Where(m => m.ChatGroupId == chatGroupId)
                .OrderBy(m => m.SentAt)
                .Select(m => new ChatMessageDTO
                {
                    ChatMessageId = m.ChatMessageId,
                    UserId = m.UserId,
                    UserName = m.User.FullName,
                    Message = m.Message,
                    SentAt = m.SentAt,
                    Role = m.User.Role
                })
                .ToListAsync();
#pragma warning restore CS8601 // Possible null reference assignment.
#pragma warning restore CS8601 // Possible null reference assignment.
        }

        public async Task<ChatMessageDTO> SendMessage(int chatGroupId, int userId, string message)
        {
            var chatGroup = await _context.ChatGroups.FindAsync(chatGroupId);
            if (chatGroup == null)
                throw new Exception("Chat group not found");

            if (!chatGroup.IsActive)
                throw new Exception("This chat group has expired");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var chatMessage = new ChatMessage
            {
                ChatGroupId = chatGroupId,
                UserId = userId,
                Message = message,
                SentAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            return new ChatMessageDTO
            {
                ChatMessageId = chatMessage.ChatMessageId,
                UserId = userId,
                UserName = user.FullName,
                Message = message,
                SentAt = chatMessage.SentAt,
                Role = user.Role
            };
        }
    }
}