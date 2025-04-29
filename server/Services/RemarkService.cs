using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Services
{
    public class RemarkService
    {
        private readonly UserDBContext _context;

        public RemarkService(UserDBContext context)
        {
            _context = context;
        }

        public List<RemarkDTO> GetRemarks()
        {
            var remarks = _context.Remarks
                .Include(r => r.Submission)
                .Include(r => r.User)
                .Select(r => new RemarkDTO
                {
                    Id = r.Id,
                    SubmissionId = r.SubmissionId,
                    Message = r.Message,
                    ResubmissionRequired = r.ResubmissionRequired,
                    ResubmissionDeadline = r.ResubmissionDeadline,
                    AssignmentTitle = r.Submission.Assignment.Title
                })
                .ToList();

            return remarks;
        }

        public List<RemarkDTO> GetRemarksByUserId(int userId)
        {
            var remarks = _context.Remarks
                .Include(r => r.Submission)
                    .ThenInclude(s => s.Assignment)
                .Include(r => r.User)
                .Where(r => r.UserId == userId)
                .Select(r => new RemarkDTO
                {
                    Id = r.Id,
                    SubmissionId = r.SubmissionId,
                    Message = r.Message,
                    ResubmissionRequired = r.ResubmissionRequired,
                    ResubmissionDeadline = r.ResubmissionDeadline,
                    AssignmentTitle = r.Submission.Assignment.Title
                })
                .ToList();

            return remarks;
        }

        public async Task<List<RemarkDTO>> GetRemarksByStudentId(int studentId)
        {
            var remarks = await _context.Remarks
                .Include(r => r.Submission)
                    .ThenInclude(s => s.Assignment)
                .Include(r => r.User)
                .Where(r => r.Submission.StudentId == studentId)
                .Select(r => new RemarkDTO
                {
                    Id = r.Id,
                    SubmissionId = r.SubmissionId,
                    TeacherId = r.UserId,
                    Message = r.Message,
                    ResubmissionRequired = r.ResubmissionRequired,
                    ResubmissionDeadline = r.ResubmissionDeadline,
                    TeacherName = r.User.FullName,
                    AssignmentTitle = r.Submission.Assignment.Title
                })
                .ToListAsync();

            return remarks;
        }

        public RemarkDTO CreateRemark(CreateRemarkRequest request, int teacherId)
        {
            var teacher = _context.Users.FirstOrDefault(u => u.UserId == teacherId && u.Role == "teacher");
            if (teacher == null)
            {
                throw new Exception("Teacher not found");
            }

            var submission = _context.Submissions
                .Include(s => s.Assignment)
                .Include(s => s.Student)
                .FirstOrDefault(s => s.SubmissionId == request.SubmissionId);

            if (submission == null)
            {
                throw new Exception("Submission not found");
            }

            var remark = new Remark
            {
                SubmissionId = request.SubmissionId,
                UserId = teacherId,
                Message = request.Message,
                ResubmissionRequired = request.ResubmissionRequired,
                ResubmissionDeadline = request.ResubmissionDeadline
            };

            try
            {
                _context.Remarks.Add(remark);
                _context.SaveChanges();

                return new RemarkDTO
                {
                    Id = remark.Id,
                    SubmissionId = remark.SubmissionId,
                    TeacherId = remark.UserId,
                    Message = remark.Message,
                    ResubmissionRequired = remark.ResubmissionRequired,
                    ResubmissionDeadline = remark.ResubmissionDeadline,
                    TeacherName = teacher.FullName,
                    AssignmentTitle = submission.Assignment.Title
                };
            }
            catch (DbUpdateException dbEx)
            {
                var innerMessage = dbEx.InnerException?.Message ?? dbEx.Message;
                Console.WriteLine("❌ Database update exception: " + innerMessage);
                throw new Exception("Failed to save remark: " + innerMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ General error: " + ex.Message);
                throw new Exception("An unexpected error occurred: " + ex.Message);
            }
        }
    }
}
