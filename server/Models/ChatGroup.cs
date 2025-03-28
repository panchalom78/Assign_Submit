namespace Server.Models
{
    public class ChatGroup
    {
        public int ChatGroupId { get; set; }
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }
        public string ExpiryDate { get; set; }
        public List<ChatMessage> Messages { get; set; }
        public bool IsActive => DateTime.Parse(ExpiryDate) >= DateTime.UtcNow;
    }
}