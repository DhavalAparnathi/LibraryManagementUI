import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  features: string[] = [
    'Admission through AC-PC procedure (No Management / NRI Quota)',
    'Means & Meritorious Scholarship to the students',
    'Air Condition Library',
    'Transportation Facility from all Ahmedabad routes',
    'Boys & Girls Separate Hostel, ATM Facility in campus',
    'Fee as per Fee Regulatory Committee. Research Grants available',
    '1 GBPS Internet with Fiber optics line / Wi-Fi Campus',
    'Project & Job placement Assistance',
    'MOU for Research & Development with known industries',
  ];
}
