using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DMSApi.Model
{
    public class FileDetails
    {
        [Key]
        public int FileId { get; set; }

        public string Department { get; set; }

        public string Attachments { get; set; }


        [Display(Name = "User")]
        public virtual int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User Users { get; set; }
    }
}
