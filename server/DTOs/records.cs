using Server.Models;
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
        public string? AssignmentTitle { get; set; }
        public string? ExpiryDate { get; set; }
        public bool IsActive { get; set; }
        public List<ChatMessageDTO>? RecentMessages { get; set; }
    }

    public class ChatMessageDTO
    {
        public int ChatMessageId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? Message { get; set; }
        public string? SentAt { get; set; }
        public string? Role { get; set; }
    }

    public class SendMessageRequest
    {
        public int ChatGroupId { get; set; }
        public string? Message { get; set; }
    }

    public class CreateRemarkRequest
    {
        public int SubmissionId { get; set; }
        public string? Message { get; set; }
        public bool ResubmissionRequired { get; set; }
        public DateTime? ResubmissionDeadline { get; set; }
        public int UserId { get; set; }
    }

    public class RemarkDTO
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int UserId { get; set; }
        public string? Message { get; set; }
        public bool ResubmissionRequired { get; set; }
        public DateTime? ResubmissionDeadline { get; set; }
        public string? UserName { get; set; }
    }
    public class SubmissionWithRemarkDTO
    {
        public Submission Submission { get; set; }
        public int RemarkCount { get; set; }
    }
    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int? CollegeId { get; set; }
        public int? FacultyId { get; set; }
        public int? CourseId { get; set; }
        public int? ClassId { get; set; }
        public string? Prn { get; set; }
    }
    
}
