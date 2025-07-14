<<<<<<< HEAD
# ICEP - Web



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/icep4/icep-web.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/icep4/icep-web/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
=======
# Admin Panel - Teacher & Student Courses Platform

A modern Vue 3 admin panel for managing teacher and student courses platform, built with TypeScript, Composition API, and best practices.

## 🚀 Features

- **Modern Vue 3 Stack**: Composition API, TypeScript, Vite
- **Authentication System**: JWT-based authentication with secure token management
- **Admin Dashboard**: Beautiful sidebar navigation with responsive design
- **Teacher Request Management**: View, approve, and reject teacher applications
- **File Management**: View teacher certificates and documents
- **State Management**: Pinia for client state, TanStack Query for server state
- **Form Validation**: Vee-validate with Yup schemas
- **UI Framework**: Element Plus with custom theming
- **Internationalization**: Vue I18n support
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠 Tech Stack

- **Frontend**: Vue 3 + TypeScript + Composition API
- **Build Tool**: Vite
- **UI Framework**: Element Plus
- **State Management**: Pinia (client state) + TanStack Query (server state)
- **Form Validation**: Vee-validate + Yup
- **HTTP Client**: Axios with interceptors
- **Router**: Vue Router 4 with navigation guards
- **Styling**: CSS with Element Plus theming
- **Internationalization**: Vue I18n

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── auth.ts            # Authentication API
│   ├── config.ts          # Axios configuration
│   └── http.ts            # HTTP client utilities
├── components/            # Reusable components
├── core/                  # Core services
│   └── services/
│       └── JwtService.ts  # JWT token management
├── i18n/                  # Internationalization
├── router/                # Vue Router configuration
├── stores/                # Pinia stores
│   └── auth.ts           # Authentication store
├── tanstack/             # TanStack Query setup
│   ├── index.ts          # Query client configuration
│   ├── types.ts          # TypeScript interfaces
│   ├── queryKeys.ts      # Query keys
│   └── queries.ts        # Query and mutation hooks
├── views/                # Page components
│   ├── auth/
│   │   └── LoginPage.vue # Login page
│   ├── dashboard/
│   │   ├── TeacherRequestsView.vue
│   │   ├── TeachersView.vue
│   │   ├── StudentsView.vue
│   │   └── SettingsView.vue
│   └── DashboardView.vue # Main dashboard layout
└── main.ts               # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learnzone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Authentication

### Login Credentials
- **Email**: `hajarrr@gmail.com`
- **Password**: `123456789`

### Authentication Flow
1. User enters credentials on login page
2. Form validation with vee-validate + yup
3. API call to `POST /authentication/login`
4. JWT token stored in cookies
5. User redirected to dashboard
6. Navigation guards protect routes

## 📊 API Endpoints

### Authentication
- `POST /authentication/login` - User login
- `GET /authentication/teacherRequest` - Get teacher requests
- `PATCH /authentication/approveTeacher/{id}` - Approve teacher request
- `PATCH /authentication/rejectTeacher/{id}` - Reject teacher request

### Teacher Management
- `GET /teacher/teacherrequestbyid/{id}` - Get teacher request details
- `GET /uploads/teacher/{filename}` - Get teacher certificate file

## 🎨 UI Components

### Dashboard Layout
- **Sidebar Navigation**: Collapsible sidebar with menu items
- **Top Header**: Page title and user info
- **Responsive Design**: Mobile-friendly layout

### Teacher Requests
- **List View**: Card-based list of pending requests
- **Detail Modal**: Comprehensive request information
- **Action Buttons**: Approve/Reject functionality
- **File Viewer**: Certificate document viewing

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ACCESS_TOKEN_NAME=access_token
VITE_REFRESH_TOKEN_NAME=refresh_token
```

### API Configuration
The API client is configured in `src/api/config.ts` with:
- Base URL configuration
- Request/response interceptors
- Error handling
- Token management
- Development logging

## 📱 Features in Detail

### Teacher Request Management
1. **View Requests**: List all pending teacher applications
2. **Request Details**: View comprehensive teacher information
3. **Approve/Reject**: Process teacher applications
4. **Certificate Viewing**: Open teacher certificates in new window
5. **Real-time Updates**: TanStack Query handles cache invalidation

### Authentication System
1. **Secure Login**: Form validation and error handling
2. **Token Management**: JWT tokens stored in secure cookies
3. **Route Protection**: Navigation guards prevent unauthorized access
4. **Auto-logout**: Token expiration handling
5. **Persistent Sessions**: Automatic authentication check on app start

### State Management
1. **Client State**: Pinia stores for UI state
2. **Server State**: TanStack Query for API data
3. **Cache Management**: Automatic cache invalidation
4. **Loading States**: Comprehensive loading indicators
5. **Error Handling**: User-friendly error messages

## 🧪 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Composition API**: Modern Vue 3 patterns
- **Component Structure**: Small, focused components

### Best Practices
- **Separation of Concerns**: API, stores, and components separated
- **Auto-imports**: Better developer experience
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 API Documentation

### Teacher Request Object
```typescript
interface TeacherRequest {
  id: number
  fName: string
  lName: string
  createdAt: string
}
```

### Teacher Request Detail
```typescript
interface TeacherRequestDetail {
  fName: string
  lName: string
  phoneNumber: string
  active: boolean
  email: string
  role: 'Teacher'
  createdAt: string
  teacher: {
    id: number
    facebookUrl: string
    instagramUrl: string
    coverLetter: string
    cv: string
    certificate: Certificate[]
  }
}
```

## 🔄 State Management

### Pinia Store (Client State)
- User authentication status
- Loading states
- Error messages
- UI preferences

### TanStack Query (Server State)
- Teacher requests data
- Request details
- Cache management
- Background updates

## 🎯 Future Enhancements

- [ ] Teacher management dashboard
- [ ] Student management system
- [ ] Course management
- [ ] Analytics and reporting
- [ ] User profile management
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Real-time notifications
- [ ] Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Vue 3, TypeScript, and modern web technologies**
>>>>>>> 7fec8d6 (Initial commit)
