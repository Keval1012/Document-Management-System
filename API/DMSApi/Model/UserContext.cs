using DMSApi.Model;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Drawing;

namespace DMSApi.Model
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<SelectedDepartment> SelectedDepartments { get; set; }
        public DbSet<FileDetails> FileDetails { get; set; }
    }
}
