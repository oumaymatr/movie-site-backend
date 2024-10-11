import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';

@Controller('admin') // Base route is /admin
export class AdminController {
  @UseGuards(AuthGuard('jwt')) // Ensure user is authenticated via JWT
  @Roles('admin') // Only allow access to users with 'admin' role
  @Get('dashboard') // GET /admin/dashboard
  getAdminDashboard() {
    return { message: 'Welcome to the admin dashboard' };
  }
}
