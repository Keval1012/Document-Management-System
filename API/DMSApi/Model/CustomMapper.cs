using AutoMapper;
using DMSApi.Model;
using DMSApi.ViewModel;
using System.Data;

namespace DMSApi.Model
{
    public class CustomMapper : Profile
    {
        public CustomMapper() 
        {
            CreateMap<User, UserVM>().ReverseMap();
            CreateMap<SelectedDepartment, UserVM>().ReverseMap();

            CreateMap<FileDetails, FileUpload>().ReverseMap();

            CreateMap<User, AllDocumentVM>().ReverseMap();
            CreateMap<FileDetails, AllDocumentVM>().ReverseMap();

            CreateMap<FileDetails, FileVM>().ReverseMap();

            CreateMap<User, FileUpload>().ReverseMap();
            CreateMap<SelectedDepartment, FileUpload>().ReverseMap();
        }
    }
}
