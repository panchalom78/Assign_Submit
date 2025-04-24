using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public RemarkDTO CreateRemark(CreateRemarkRequest request, int userId)
        
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null)
            {   
                throw new Exception("User not found");
            }   
            
            var remark = new Remark
            {
                SubmissionId = request.SubmissionId,
                UserId = userId,
                Message = request.Message,
                ResubmissionRequired = request.ResubmissionRequired,
                ResubmissionDeadline = request.ResubmissionDeadline
            };

            try
            {
                _context.Remarks.Add(remark);
                _context.SaveChanges();
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

            return new RemarkDTO
            {
                Id = remark.Id,
                SubmissionId = remark.SubmissionId,
                UserId = remark.UserId,
                Message = remark.Message,
                ResubmissionRequired = remark.ResubmissionRequired,
                ResubmissionDeadline = remark.ResubmissionDeadline
            };
        }
    }
}
