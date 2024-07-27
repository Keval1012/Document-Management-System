using DMSApi.Model;
using DMSApi.ViewModel;

namespace DMSApi.Interface
{
    public interface IUserRepository
    {
        IEnumerable<AllDocumentVM> GetUsers();
        IEnumerable<FileVM> GetFileDetails();

        User AddDocument(UserVM user);

        AllDocumentVM GetUserId(int UId);
        User UpdateUser(UserVM user);
        User DeleteUser(int UID);
        FileDetails DeleteFile(int FID);
    }
}
