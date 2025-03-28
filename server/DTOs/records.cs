namespace Server.DTOs
{
    public record CreateAssignmentRequest(int AssignmentId, string Title, string Description, string DueDate, string SubmittedOn, int ClassId);
    public class StudentAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? DueDate { get; set; }
        public string? SubmittedOn { get; set; }
        public bool IsSubmitted { get; set; }
        public SubmissionDTO? Submission { get; set; }
    }

    public class SubmissionDTO
    {
        public int SubmissionId { get; set; }
        public int AssignmentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
        public string? FilePath { get; set; }
    }

    public class GradeSubmissionRequest
    {
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
    }

    public class SubmissionResponseDTO
    {
        public int SubmissionId { get; set; }
        public int StudentId { get; set; }
        public int AssignmentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string? FilePath { get; set; }
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
        public string? StudentName { get; set; }
    }

    public class ChatGroupDTO
    {
        public int ChatGroupId { get; set; }
        public int AssignmentId { get; set; }
        public string AssignmentTitle { get; set; }
        public string ExpiryDate { get; set; }
        public bool IsActive { get; set; }
        public List<ChatMessageDTO> RecentMessages { get; set; }
    }

    public class ChatMessageDTO
    {
        public int ChatMessageId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Message { get; set; }
        public string SentAt { get; set; }
        public string Role { get; set; }
    }

    public class SendMessageRequest
    {
        public int ChatGroupId { get; set; }
        public string Message { get; set; }
    }

}
