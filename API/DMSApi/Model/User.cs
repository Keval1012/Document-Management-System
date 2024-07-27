using System.ComponentModel.DataAnnotations;

namespace DMSApi.Model
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Title { get; set; }
    }
}
