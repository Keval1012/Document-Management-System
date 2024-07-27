using DMSApi.Model;

namespace DMSApi.ViewModel
{
    public class AllDocumentVM
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        //public List<int> DepartmentId { get; set; }
        public List<string> DepartmentName { get; set; }

        public List<string> Attachments { get; set; }

        public List<int> FileId { get; set; }

        public List<DocumentForDepartment> DocForEachDep { get; set; }
    }
}
