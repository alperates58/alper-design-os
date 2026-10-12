using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace LegacyWebApp.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        [Route("/")]
        [Route("/Home")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/Home/Details/{id}")]
        public IActionResult Details(int id)
        {
            return View(id);
        }

        [Authorize(Roles = "Admin,Manager")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/Home/UpdateStatus")]
        public IActionResult UpdateStatus(string recordId, string status)
        {
            // Mutating business logic with CSRF and Role authorization
            return RedirectToAction("Index");
        }
    }
}
