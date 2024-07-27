namespace DMSApi.ViewModel
{
    public class UserVM
    {
        public int UserId { get; set; }
        public string Title { get; set; }


        //public List<int> DepartmentId { get; set; }
        public List<string> DepartmentName { get; set; }


        //public List<string> DocumentId { get; set; }

        //public IList<IFormFile> Attachments { get; set; }
    }
}
