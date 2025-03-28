namespace Server.Models
{
    public class ChatMessage
    {
        public int ChatMessageId { get; set; }
        public int ChatGroupId { get; set; }
        public ChatGroup ChatGroup { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Message { get; set; }
        public string SentAt { get; set; }
    }
}