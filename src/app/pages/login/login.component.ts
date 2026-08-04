import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  redirectUrl = '/search';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/my-bookings']);
      return;
    }

    const redirect = this.route.snapshot.queryParamMap.get('redirectUrl');
    if (redirect) {
      this.redirectUrl = redirect;
    }
  }

  login(): void {
    this.error = '';
    if (!this.authService.login(this.username, this.password)) {
      this.error = 'Please enter a valid username and password.';
      return;
    }

    this.router.navigateByUrl(this.redirectUrl);
  }
}
