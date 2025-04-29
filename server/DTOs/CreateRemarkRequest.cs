namespace Server.DTOs
{
    public class CreateRemarkRequest
    {
        public int SubmissionId { get; set; }
        public string Message { get; set; }
        public bool ResubmissionRequired { get; set; }
        public DateTime? ResubmissionDeadline { get; set; }
    }
}