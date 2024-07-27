namespace DMSApi.Model
{
    public class DocumentForDepartment
    {
        public string Department { get; set; }
        public List<string> DocumentList { get; set; }
        public List<int> FileId { get; set; }
    }
}
