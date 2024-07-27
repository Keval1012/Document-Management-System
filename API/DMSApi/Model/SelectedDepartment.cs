using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace DMSApi.Model
{
    public class SelectedDepartment
    {
        [Key]
        public int SelectedDepartmentID { get; set; }
        public string DepartmentName { get; set; }


        [Display(Name = "User")]
        public virtual int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User Users { get; set; }
    }
}
