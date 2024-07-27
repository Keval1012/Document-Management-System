using DMSApi.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace DMSApi.ViewModel
{
    public class FileVM
    {
        //public int FileId { get; set; }
        //public IList<IFormFile> Attachments { get; set; }
        //public int UserId { get; set; }


        public int FileId { get; set; }
        public string Attachments { get; set; }
        public int UserId { get; set; }
    }
}
