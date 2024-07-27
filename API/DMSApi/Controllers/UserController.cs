using AutoMapper;
using DMSApi.Interface;
using DMSApi.Model;
using DMSApi.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using System.Text.Json;

namespace DMSApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository Iuser;
        private readonly IConfiguration configuration;
        private readonly UserContext dB;

        private readonly IMapper _mapper;
        //private object JsonConvert;

        public UserController(IUserRepository user, IConfiguration _configuration, UserContext userContext, IMapper mapper)
        {
            Iuser = user;
            configuration = _configuration;
            dB = userContext;

            _mapper = mapper;
        }


        [HttpGet]
        [Route("GetAllFiles")]
        public IActionResult FileList()
        {
            return Ok(Iuser.GetFileDetails().ToList());
        }


        [HttpGet]
        [Route("GetUser")]
        public IActionResult Index()
        {
            var user = Iuser.GetUsers().ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddDocument")]
        public IActionResult Create(UserVM user)
        {
            var add = Iuser.AddDocument(user);
            return Ok(add);
        }



        //[HttpPost]
        //[Route("AddUpdateDocument")]
        //public async Task<IActionResult> Upload([FromForm] FileUpload model)
        //{
        //    var list = dB.Users.Where(a => a.UserId == model.UserId).ToList();
        //    var departmentList = dB.SelectedDepartments.Where(b => b.UserId == model.UserId).Select(c => c.DepartmentName).ToList();

        //    if (list.Count != 0)
        //    {
        //        if (model == null || model.Department == null || model.Attachments == null || model.Attachments.Count == 0)
        //        {
        //            return BadRequest("No files were provided.");
        //        }

        //        var uploadedFilePaths = new List<string>();

        //        foreach (var file in model.Attachments)
        //        {
        //            if (file.Length == 0)
        //            {
        //                continue;
        //            }

        //            //var fileName = Path.GetExtension(file?.FileName);

        //            //var filePath = Path.Combine("G:\\Keval\\DMS\\DMSApi\\DMSApi\\DMSApi\\Files", file?.FileName);
        //            //var filePath = Path.Combine("G:\\Files", file?.FileName);
        //            var filePath = Path.Combine(file?.FileName);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await file.CopyToAsync(stream);
        //            }

        //            uploadedFilePaths.Add(filePath);

        //            FileDetails select = new FileDetails()
        //            {
        //                UserId = model.UserId,
        //                //Department = model.Department,
        //                Department = Convert.ToString(model.Department),
        //                Attachments = filePath
        //            };
        //            dB.FileDetails.Add(select);
        //            dB.SaveChanges();
        //        }
        //        return Ok(new { Message = "Files uploaded successfully.", FilePathList = uploadedFilePaths });
        //        //return Ok(new { Message = "Files uploaded successfully." });
        //    }
        //    return Ok(new { Message = "User is not available." });
        //}


        //[HttpPost("AddUpdateDocument")]
        //[HttpPost]
        //[Route("AddUpdateDocument")]
        //public async Task<IActionResult> Upload([FromForm] FileUpload model)
        //{
        //    var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

        //    if (user != null)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var uploadedFilePaths = new List<string>();

        //        for (int j = 0; j < model.Attachments.Count; j++)
        //        {
        //            var file = model.Attachments[j];
        //            var department = model.Department[j];

        //            var filePath = Path.Combine(file?.FileName);

        //            using (var stream = new FileStream(filePath, FileMode.Create))
        //            {
        //                await file.CopyToAsync(stream);
        //            }

        //            uploadedFilePaths.Add(filePath);

        //            var fileDetails = new FileDetails
        //            {
        //                UserId = model.UserId,
        //                Department = department,
        //                Attachments = filePath,
        //            };

        //            dB.FileDetails.Add(fileDetails);
        //            dB.SaveChanges();
        //        }
        //        return Ok(new { Message = "Files uploaded successfully." });
        //    }
        //    return Ok(new { Message = "User is not available." });
        //}



        [HttpPost]
        [Route("AddUpdateDocument")]
        public async Task<IActionResult> Upload([FromForm] FileUpload model)
        {
            var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

            if (user != null)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingDocuments = dB.FileDetails.Where(fd => fd.UserId == model.UserId && !(model.Department.Contains(fd.Department))).ToList();

                foreach (var item in existingDocuments)
                {
                    var oldDepartment = dB.FileDetails.Where(fd => fd.UserId == model.UserId && fd.Department == item.Department);

                    if (oldDepartment != null)
                    {
                        dB.FileDetails.RemoveRange(oldDepartment);
                    }
                }

                var uploadedFilePaths = new List<string>();

                for (int j = 0; j < model.Attachments.Count; j++)
                {
                    var file = model.Attachments[j];
                    var department = model.Department[j];

                    var existingDepartment = dB.FileDetails.FirstOrDefault(fd => fd.UserId == model.UserId && fd.Department == department && fd.Attachments == file.FileName);

                    if (existingDepartment != null)
                    {
                        var filePath = Path.Combine(file?.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        existingDepartment.Attachments = filePath;
                    }
                    else
                    {
                        var filePath = Path.Combine(file?.FileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var fileDetails = new FileDetails
                        {
                            UserId = model.UserId,
                            Department = department,
                            Attachments = filePath,
                        };

                        dB.FileDetails.Add(fileDetails);
                    }
                }
                dB.SaveChanges();
                return Ok(new { Message = "Files uploaded successfully." });
            }
            return Ok(new { Message = "User is not available." });
        }



        //[HttpPost] 
        //[Route("AddUpdateDocument")]
        //public async Task<IActionResult> Upload1([FromForm] FileUpload model, [FromForm] string attachments)
        //{
        //    var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

        //    //List<string> attachmentList = JsonConvert.DeserializeObject<List<string>>(attachments);

        //    var files = attachments;
        //    var jsonModel = JsonConvert.DeserializeObject<JsonModel>(files);

        //    if (user != null)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var uploadedFilePaths = new List<string>();

        //        for (int j = 0; j < model.Attachments.Count; j++)
        //        {
        //            var file = model.Attachments[j];
        //            var department = model.Department[j];


        //            if (file.ContentType == "application/json")
        //            {
        //                using (var streamReader = new StreamReader(file.OpenReadStream()))
        //                {
        //                    var jsonString = await streamReader.ReadToEndAsync();

        //                    //var obj = JsonConvert.DeserializeObject<YourObjectType>(jsonString);
        //                    //var jsonModel = JsonSerializer.Deserialize<JsonModel>(jsonString);

        //                    return Ok(new { Message = "JSON data processed successfully." });
        //                }
        //            }
        //            else
        //            {
        //                var filePath = Path.Combine(file?.FileName);

        //                using (var stream = new FileStream(filePath, FileMode.Create))
        //                {
        //                    await file.CopyToAsync(stream);
        //                }

        //                uploadedFilePaths.Add(filePath);

        //                var fileDetails = new FileDetails
        //                {
        //                    UserId = model.UserId,
        //                    Department = department,
        //                    Attachments = filePath,
        //                };

        //                dB.FileDetails.Add(fileDetails);
        //                dB.SaveChanges();
        //            }

        //        }
        //        return Ok(new { Message = "Files uploaded successfully." });
        //    }
        //    return Ok(new { Message = "User is not available." });
        //}


        //[HttpPost]
        //[Route("AddUpdateDocument2")]
        //public async Task<IActionResult> Upload2([FromForm] string attachments)
        //{
        //    var files = attachments;
        //    var jsonModel = JsonConvert.DeserializeObject<JsonModel>(files);

        //     return Ok(new { Message = "Files uploaded successfully." });
        //}


        //[HttpPost]
        //[Route("AddUploadUpdateDocument")]
        //public async Task<IActionResult> UploadUpdateDocument([FromForm] FileUpload model)
        //{
        //    var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

        //    if (user != null)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var uploadedFilePaths = new List<string>();

        //        var existingDocuments = dB.FileDetails.Where(fd => fd.UserId == model.UserId && model.Department.Contains(fd.Department)).ToList();
        //        //if (existingDocuments.Count != 0)
        //        //{
        //        //    foreach (var existingDocument in existingDocuments)
        //        //    {
        //        //        dB.FileDetails.Remove(existingDocument);
        //        //    }
        //        //}


        //        //foreach (var existingDocument in existingDocuments)
        //        //{
        //        //    var dep = new List<String>();
        //        //    //existingDocument.Department = model.Department;
        //        //    existingDocument.Department = Convert.ToString(model.Department);
        //        //}


        //        var departmentList = dB.FileDetails.Where(x => x.UserId == model.UserId && model.Department.Contains(x.Department)).ToList();

        //        foreach (var item in model.Department)
        //        {
        //            foreach (var department in departmentList)
        //            {
        //                if (department.Department != item)
        //                {
        //                    for (int j = 0; j < model.Attachments.Count; j++)
        //                    {
        //                        var file = model.Attachments[j];
        //                        //var department = model.Department[j];

        //                        var filePath = Path.Combine(file?.FileName);

        //                        using (var stream = new FileStream(filePath, FileMode.Create))
        //                        {
        //                            await file.CopyToAsync(stream);
        //                        }

        //                        uploadedFilePaths.Add(filePath);

        //                        var fileDetails = new FileDetails
        //                        {
        //                            UserId = model.UserId,
        //                            //Department = department,
        //                            Department = item,
        //                            Attachments = filePath,
        //                        };

        //                        dB.FileDetails.Add(fileDetails);
        //                    }
        //                }
        //            }


        //            //for (int j = 0; j < model.Attachments.Count; j++)
        //            //{
        //            //    var file = model.Attachments[j];
        //            //    //var department = model.Department[j];

        //            //    var filePath = Path.Combine(file?.FileName);

        //            //    using (var stream = new FileStream(filePath, FileMode.Create))
        //            //    {
        //            //        await file.CopyToAsync(stream);
        //            //    }

        //            //    uploadedFilePaths.Add(filePath);

        //            //    var fileDetails = new FileDetails
        //            //    {
        //            //        UserId = model.UserId,
        //            //        //Department = department,
        //            //        Department = item,
        //            //        Attachments = filePath,
        //            //    };

        //            //    dB.FileDetails.Add(fileDetails);
        //            //}
        //        }

        //        dB.SaveChanges();
        //        return Ok(new { Message = "Files uploaded/updated successfully." });
        //    }

        //    return Ok(new { Message = "User is not available." });
        //}


        //[HttpPost]
        //[Route("UpdateDocument")]
        //public async Task<IActionResult> UpdateDocumentFileUpload([FromForm] FileUpload model)
        //{
        //    var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

        //    if (user != null)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var uploadedFilePaths = new List<string>();

        //        for (int j = 0; j < model.Attachments.Count; j++)
        //        {
        //            var file = model.Attachments[j];
        //            var department = model.Department[j];
        //            var userId = model.UserId; // Assuming you have a property for document ID
        //            var documentId = model.FileId;

        //            // Check if the document exists
        //            var existingDocument = dB.FileDetails.FirstOrDefault(fd => fd.UserId == userId);

        //            if (existingDocument != null)
        //            {
        //                // Update the existing document properties
        //                existingDocument.Department = department;

        //                // Add logic to update other properties if needed

        //                // Optionally, update the file path in the file system

        //                var filePath = Path.Combine(file?.FileName);
        //                using (var stream = new FileStream(filePath, FileMode.Create))
        //                {
        //                    await file.CopyToAsync(stream);
        //                }
        //                uploadedFilePaths.Add(filePath);
        //                existingDocument.Attachments = Path.Combine(filePath, Path.GetFileName(existingDocument.Attachments));

        //                var fileDetails = new FileDetails
        //                {

        //                    FileId = documentId,
        //                    UserId = userId,
        //                    Department = department,
        //                    Attachments = filePath,
        //                }; 
        //                // how to update the only department in post Api 

        //                dB.FileDetails.Add(fileDetails);
        //                dB.SaveChanges();
        //            }
        //            else
        //            {
        //                // Handle the case where the document with the specified ID is not found
        //                return NotFound(new { Message = "Document not found." });
        //            }
        //        }

        //        dB.SaveChanges();
        //        return Ok(new { Message = "Files updated successfully." });
        //    }

        //    return Ok(new { Message = "User is not available." });
        //}


        //[HttpPost]
        //[Route("UpdateDepartment")]
        //public IActionResult UpdateDepartment([FromForm] UpdateDepartmentModel model)
        //{
        //    var user = dB.Users.FirstOrDefault(a => a.UserId == model.UserId);

        //    if (user != null)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        // Check if the document exists
        //        var existingDocument = dB.FileDetails.FirstOrDefault(fd => fd.FileId == model.DocumentId);

        //        if (existingDocument != null)
        //        {
        //            // Update the department

        //            existingDocument.Department = model.Department;

        //            // Optionally, update other properties if needed

        //            dB.SaveChanges();
        //            return Ok(new { Message = "Department updated successfully." });
        //        }
        //        else
        //        {
        //            // Handle the case where the document with the specified ID is not found
        //            return NotFound(new { Message = "Document not found." });
        //        }
        //    }

        //    return Ok(new { Message = "User is not available." });
        //}


        [HttpGet]
        [Route("GetUserByID")]
        public ActionResult Edit([Required] int id)
        {
            AllDocumentVM user = Iuser.GetUserId(id);
            return Ok(user);
        }


        [HttpPut]
        [Route("UpdateUser")]
        public IActionResult Edit(UserVM user)
        {
            var list = dB.Users.Where(a => a.UserId == user.UserId).ToList();

            if (list.Count != 0)
            {
                Iuser.UpdateUser(user);
                return Ok(user);
            }

            return Ok(new { Message = "User is not available." });
        }


        [HttpDelete]
		[Route("DeleteUser")]
		public bool DeleteUsers([Required] int id)
		{
			Iuser.DeleteUser(id);
			return true;
		}


        [HttpDelete]
        [Route("DeleteFile")]
        public bool DeleteFileDetails([Required] int id)
        {
            Iuser.DeleteFile(id);
            return true;
        }


        [HttpDelete("{userId}/{department}")]
        public IActionResult DeleteDepartment([Required] int userId, [Required] string department)
        {
            var user = dB.Users.FirstOrDefault(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            var filesToDelete = dB.FileDetails.Where(fd => fd.UserId == userId && fd.Department == department);
            var departmentsToDelete = dB.SelectedDepartments.Where(dd => dd.UserId == userId && dd.DepartmentName == department);

            if (!filesToDelete.Any() || !departmentsToDelete.Any())
            {
                return NotFound(new { Message = "No files found for the specified department." });
            }

            dB.FileDetails.RemoveRange(filesToDelete);
            dB.SelectedDepartments.RemoveRange(departmentsToDelete);
            dB.SaveChanges();

            return Ok(new { Message = $"Department '{department}' deleted successfully." });
        }


        [HttpDelete("delete-multiple-document")]
        //public IActionResult DeleteMultiple([FromBody] List<int> ids)
        public IActionResult DeleteMultiple([Required] List<int> ids)
        {
            try
            {
                var entitiesToDelete = dB.FileDetails.Where(e => ids.Contains(e.FileId)).ToList();

                if (entitiesToDelete.Count == 0)
                {
                    return NotFound("No matching Documents found for deletion.");
                }

                dB.FileDetails.RemoveRange(entitiesToDelete);
                dB.SaveChanges();

                return Ok("Documents deleted successfully.");
            }
            catch (Exception ex)
            {
                // Handle exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}