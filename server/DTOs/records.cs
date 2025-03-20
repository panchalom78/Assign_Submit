namespace Server.DTOs
{
    public record CreateAssignmentRequest(int AssignmentId, string Title, string Description, string DueDate, string SubmittedOn, int ClassId);
}
