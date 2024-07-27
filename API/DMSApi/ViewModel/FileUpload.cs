using DMSApi.Model;
using Microsoft.VisualBasic.FileIO;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace DMSApi.ViewModel
{
    public class FileUpload
    {
        //public List<int> FIleId { get; set; }
        //public IFormFile FileDetails { get; set; }

        //public FileType FileType { get; set; }
        //public int Length { get; internal set; }
        //public string FileName { get; internal set; }


        public string Title { get; set; }
        public int UserId { get; set; }

        //public string Department { get; set; }
        public List<string> Department { get; set; }

        public IList<IFormFile> Attachments { get; set; }


        //public List<FinalVM> FinalVMs { get; set; }
    }
}
