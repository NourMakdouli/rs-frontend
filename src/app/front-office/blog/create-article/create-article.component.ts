import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/core/models/tag';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TagsService } from 'src/app/core/services/tags.service';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  previewUrl: any = null;
  tags: Tag[] = [];  // Initialized to an empty array
  selectedTags: Tag[] = [];  // Initialized to an empty array
  userId: string;
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private tagsService: TagsService,
    private authService:AuthService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
this.authService.currentUser.subscribe((user) => {
  if(user){
    this.userId=user._id;
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      image: ['', Validators.required],
      author: [this.userId],
      tags: [[]],  // Store selected tag IDs
      isDraft: [false]  // Default to not a draft
    });
    console.log("current User",this.userId);
  } else  {
    this.toastr.error('You need to login in order to see this.', 'Error', {
      progressBar: true,
      closeButton: true,
    });

    console.log('No user found, redirecting to login...');
    this.router.navigate(['/login']);   }
})

   

    // Fetch predefined tags
    this.tagsService.getTags().subscribe({
      next: (tags: Tag[]) => {
        this.tags = tags;
      },
      error: (err) => {
        console.error('Failed to fetch tags', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const element = event.currentTarget as HTMLInputElement;
    const file: File | null = element.files ? element.files[0] : null;

    if (file) {
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.articleForm.patchValue({ image: response.url });
        },
        error: (error) => {
          console.error('Upload error:', error);
        },
        complete: () => {
          console.log('Upload complete');
        }
      });

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected or file is invalid.');
    }
  }

  addTag(tagName: string): void {
    if (!tagName) return;

    const existingTag = this.tags.find(tag => tag.name === tagName);

    if (existingTag && !this.selectedTags.some(tag => tag._id === existingTag._id)) {
      this.selectedTags.push(existingTag);
      this.updateTagsFormControl();
    } else if (!existingTag) {
      this.tagsService.createTag(tagName).subscribe(newTag => {
        this.tags.push(newTag);
        this.selectedTags.push(newTag);
        this.updateTagsFormControl();
      });
    }
  }

  removeTag(tagId: string): void {
    this.selectedTags = this.selectedTags.filter(tag => tag._id !== tagId);
    this.updateTagsFormControl();
  }

  private updateTagsFormControl(): void {
    const tagIds = this.selectedTags.map(tag => tag._id);
    this.articleForm.patchValue({ tags: tagIds });
  }

  onTagSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const tagName = selectElement.value;
    this.addTag(tagName);
  }

  onSubmit(isDraft: boolean): void {
    if (isDraft) {
      if (!this.articleForm.valid) {
        return;
      }
      this.articleForm.patchValue({ isDraft: true });
    } else {
      if (!this.articleForm.valid) {
        return;
      }
      this.articleForm.patchValue({ isDraft: false });
    }
  console.log(this.articleForm.value);
    this.articleService.createArticle(this.articleForm.value).subscribe(
      (res) => {
        console.log('Article created successfully', res);
        this.toastr.success('Article created successfully', 'Success', {
          progressBar: true,
          closeButton: true,
        });

        this.router.navigate(['/articlesByUser']); // Redirect to article list or another route
      },
      (err) => {
        this.toastr.error('Article creation failed', 'Error', {
          progressBar: true,
          closeButton: true,
        });
    
    
        console.error('Article creation failed', err);
      }
    );
  }
  
  
}
