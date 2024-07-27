using AutoMapper;
using DMSApi.Interface;
using DMSApi.Model;
using DMSApi.ViewModel;
using Microsoft.AspNetCore.Mvc;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace DMSApi.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserContext dB;
        private readonly IMapper _mapper;

        private IHostingEnvironment _hostingEnvironment;

        public UserRepository(UserContext userContext, IMapper mapper, IHostingEnvironment hostingEnvironment)
        {
            dB = userContext;
            _mapper = mapper;

            _hostingEnvironment = hostingEnvironment;
        }


        public IEnumerable<FileVM> GetFileDetails()
        {
            var list1 = dB.FileDetails.ToList();
            var list2 = dB.FileDetails.Select(x => x.FileId).ToList();
            List<FileVM> map = _mapper.Map<List<FileVM>>(list1);
            return map;
        }


        public IEnumerable<AllDocumentVM> GetUsers()
        {
            var list = dB.Users.ToList();
            List<AllDocumentVM> map = _mapper.Map<List<AllDocumentVM>>(list);

            foreach (var item in map)
            {
                var departmentList = dB.SelectedDepartments.Where(x => x.UserId == item.UserId).Select(x => x.DepartmentName).ToList();
                List<string> stringList = new List<string>();
                foreach (var item1 in departmentList)
                {
                    var skName = dB.SelectedDepartments.Where(x => x.DepartmentName == item1).Select(x => x.DepartmentName).FirstOrDefault();
                    stringList.Add(skName);
                    item.DepartmentName = stringList;
                }
            }

            foreach (var item in map)
            {
                var documentList = dB.FileDetails.Where(x => x.UserId == item.UserId).Select(x => x.Attachments).ToList();
                List<string> stringList = new List<string>();
                foreach (var item1 in documentList)
                {
                    var skName = dB.FileDetails.Where(x => x.Attachments == item1).Select(x => x.Attachments).FirstOrDefault();
                    stringList.Add(skName);
                    item.Attachments = stringList;
                }
            }

            foreach (var item in map)
            {
                var fileList = dB.FileDetails.Where(x => x.UserId == item.UserId).Select(x => x.FileId).ToList();
                List<int> intList = new List<int>();
                foreach (var item1 in fileList)
                {
                    var skName = dB.FileDetails.Where(x => x.FileId == item1).Select(x => x.FileId).FirstOrDefault();
                    intList.Add(skName);
                    item.FileId = intList;
                }
            }

            foreach (var user in map)
            {
                var departmentList = dB.SelectedDepartments.Where(x => x.UserId == user.UserId).Select(x => x.DepartmentName).ToList();
                var documentListForEachDepartment = new List<DocumentForDepartment>();

                foreach (var department in departmentList)
                {
                    var fileList = dB.FileDetails.Where(x => x.UserId == user.UserId && x.Department == department).Select(x => x.Attachments).ToList();
                    var fileId = dB.FileDetails.Where(x => x.UserId == user.UserId && x.Department == department).Select(x => x.FileId).ToList();
                    var documentForDepartment = new DocumentForDepartment
                    {
                        FileId = fileId,
                        Department = department,
                        DocumentList = fileList
                    };
                    documentListForEachDepartment.Add(documentForDepartment);
                }

                user.DocForEachDep = documentListForEachDepartment;
            }

            return map.OrderByDescending(a => a.UserId);
        }

        public User AddDocument(UserVM user)
        {
            var map = _mapper.Map<User>(user);
            dB.Users.Add(map);
            dB.SaveChanges();

            foreach (var item in user.DepartmentName)
            {
                SelectedDepartment select = new SelectedDepartment()
                {
                    UserId = map.UserId,
                    DepartmentName = Convert.ToString(item)
                };
                dB.SelectedDepartments.Add(select);
                dB.SaveChanges();
            }

            return map;
        }

        public AllDocumentVM GetUserId(int id)
        {
            var get = dB.Users.Find(id);
            var map = _mapper.Map<AllDocumentVM>(get);

            var list = dB.SelectedDepartments.Where(x => x.UserId == id).Select(x => x.DepartmentName).ToList();
            List<string> stringList = new List<string>();
            foreach (var item in list)
            {
                stringList.Add(item);
            }
            map.DepartmentName = stringList;


            var docList = dB.FileDetails.Where(y => y.UserId == id).Select(y => y.Attachments).ToList();
            List<string> docStringList = new List<string>();
            foreach (var docItem in docList)
            {
                docStringList.Add(docItem);
            }
            map.Attachments = docStringList;

            return map;
        }


        public User UpdateUser(UserVM user)
        {
            var map = _mapper.Map<User>(user);
            dB.Users.Update(map);
            dB.SaveChanges();

            var departmentList = dB.SelectedDepartments.Where(x => x.UserId == user.UserId).ToList();
            if (departmentList.Count > 0)
            {
                dB.SelectedDepartments.RemoveRange(departmentList);
                dB.SaveChanges();
            }
            foreach (var item in user.DepartmentName)
            {
                SelectedDepartment select = new SelectedDepartment()
                {
                    UserId = map.UserId,
                    DepartmentName = item
                };
                dB.SelectedDepartments.Add(select);
                dB.SaveChanges();
            }

            return map;
        }


        public User DeleteUser(int UID)
        {
            var user = dB.Users.Find(UID);
            dB.Users.Remove(user);
            dB.SaveChanges();
            return user;
        }


        public FileDetails DeleteFile(int FID)
        {
            var file = dB.FileDetails.Find(FID);
            dB.FileDetails.Remove(file);
            dB.SaveChanges();
            return file;
        }

    }
}