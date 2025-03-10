import React, { useState } from 'react';
import { FaUpload, FaComment, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Remark = () => {
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [file, setFile] = useState(null);

  // Sample data for remarks
  const remarks = [
    {
      id: 1,
      assignmentTitle: "Algebra Fundamentals",
      subject: "Mathematics",
      remark: "Please correct the calculations in question 3.",
      status: "Resubmit",
      teacher: "Mr. Sharma",
      feedback: "Your approach was good, but there were calculation errors.",
    },
    {
      id: 2,
      assignmentTitle: "Chemical Reactions Lab",
      subject: "Chemistry",
      remark: "Well done! No changes needed.",
      status: "Approved",
      teacher: "Ms. Patel",
      feedback: "Excellent work! Keep it up.",
    },
    {
      id: 3,
      assignmentTitle: "History Essay",
      subject: "History",
      remark: "Add more references to support your arguments.",
      status: "Pending",
      teacher: "Mr. Singh",
      feedback: "Your essay is well-written but lacks references.",
    },
  ];

  const handleResubmit = (remarkId) => {
    console.log("Resubmitting assignment for remark:", remarkId);
    setSelectedRemark(null);
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Remarks
        </h1>

        {/* Remark List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remarks.map((remark) => (
            <div
              key={remark.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedRemark(remark)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      remark.status === 'Resubmit'
                        ? 'bg-red-100 text-red-600'
                        : remark.status === 'Approved'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {remark.status}
                  </span>
                  <FaComment className="text-gray-400" />
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {remark.assignmentTitle}
                </h3>
                <p className="text-gray-600 mb-4">{remark.subject}</p>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Teacher:</span>
                  <span className="font-semibold">{remark.teacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remark Details Modal */}
        {selectedRemark && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRemark.assignmentTitle}
                </h2>
                <button
                  onClick={() => setSelectedRemark(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedRemark.remark}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-2">Teacher:</span>
                  <span className="font-semibold">{selectedRemark.teacher}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Feedback:</strong> {selectedRemark.feedback}
                </div>
              </div>

              {/* Resubmit Section */}
              {selectedRemark.status === 'Resubmit' && (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 ${
                      file ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedFile = e.dataTransfer.files[0];
                      if (droppedFile) setFile(droppedFile);
                    }}
                  >
                    <FaUpload className="text-3xl text-purple-500 mx-auto mb-4" />
                    {file ? (
                      <p className="text-purple-600">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-600">Drag & drop files here</p>
                        <p className="text-gray-400 text-sm mt-2">
                          or click to select files (PDF, DOCX)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          id="file-upload"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-block mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleResubmit(selectedRemark.id)}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    disabled={!file}
                  >
                    {file ? "Resubmit Assignment" : "Select File to Resubmit"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remark;