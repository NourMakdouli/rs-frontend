import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ProductType, ProductCondition, EnergyConsumption } from '../../../core/models/product';
import { FileUploadService } from 'src/app/core/utils/sharedServices/upload.service';
import { AuthService } from 'src/app/core/services/auth.service';  // Import the authentication service
import { User } from 'src/app/core/models/user';
import { FormValidationService } from 'src/app/core/utils/sharedServices/form-validation.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  previewImages: string[] = [];
  currentUser: User | null = null;
submitted:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formValidationService: FormValidationService) 
    {
      this.productForm = this.formBuilder.group({
        type: [ProductType.Sale, [this.formValidationService.requiredField()]],
        title: ['', [this.formValidationService.requiredField(), this.formValidationService.minLength(3)]],
        address: ['', [this.formValidationService.requiredField()]],
        postalCode: ['', [this.formValidationService.requiredField(), this.formValidationService.minLength(4)]],
        description: ['', [this.formValidationService.requiredField(), this.formValidationService.minLength(10)]],
        numberOfPieces: [1, [this.formValidationService.requiredField(), this.formValidationService.positiveNumberValidator()]],
        condition: [ProductCondition.New, [this.formValidationService.requiredField()]],
        priceExcludingFees: [0, [this.formValidationService.requiredField(), this.formValidationService.positiveNumberValidator()]],
        energyConsumption: [EnergyConsumption.Low, [this.formValidationService.requiredField()]],
        fees: [0, [this.formValidationService.requiredField(), this.formValidationService.positiveNumberValidator()]],
        numberOfRooms: [0],
        surface: [1, this.formValidationService.positiveNumberValidator()],
        photos: this.formBuilder.array([this.createPhotoField()], [this.formValidationService.minimumImagesRequired(1)]),
        keywords: this.formBuilder.array([this.createKeywordField()])
      });
      
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product) => {
        this.productForm.patchValue(product);
        this.setPhotos(product.photos || ['http://localhost:3000/uploads/default-image.png']);  // Set default image if null
        this.setKeywords(product.keywords);
      });
    } else {
      this.setPhotos(['http://localhost:3000/uploads/default-image.png']);  // Set default image if null
    }
  }

  createPhotoField(url: string = ''): FormGroup {
    return this.formBuilder.group({
      photo: [url, Validators.required]
    });
  }

  createKeywordField(): FormGroup {
    return this.formBuilder.group({
      keyword: ['']
    });
  }

  addPhotoField(): void {
    if (this.photos.length < 5) {
      this.photos.push(this.createPhotoField());
    }
  }

  addKeywordField(): void {
    if (this.keywords.length < 5) {
      this.keywords.push(this.createKeywordField());
    }
  }

  removePhotoField(index: number): void {
    this.photos.removeAt(index);
  }

  removeKeywordField(index: number): void {
    this.keywords.removeAt(index);
  }

  onKeywordChange(index: number): void {
    const keywordControl = this.keywords.at(index);
    if (keywordControl.value.trim() === '') {
      this.removeKeywordField(index);
    }
  }

  setPhotos(photos: string[]): void {
    this.photos.clear();
    if (!photos.length) {
      photos = ['http://localhost:3000/uploads/default-image.png'];  // Ensure there's always at least one photo
    }
    photos.forEach(photo => {
      this.photos.push(this.createPhotoField(photo));
    });
  }

  setKeywords(keywords: string[] | undefined): void {
    this.keywords.clear();
    if (keywords && keywords.length) {
      keywords.forEach(keyword => {
        this.keywords.push(this.formBuilder.group({ keyword }));
      });
    } else {
      this.keywords.push(this.createKeywordField());
    }
  }

  get photos(): FormArray {
    return this.productForm.get('photos') as FormArray;
  }

  get keywords(): FormArray {
    return this.productForm.get('keywords') as FormArray;
  }

  onFileChange(event: any, index: number): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages[index] = e.target.result;  // Preview the uploaded image immediately
      };
      reader.readAsDataURL(file);
  
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          this.photos.at(index).get('photo')?.setValue(response.url);  // Save the URL after upload
        },
        error: (error) => {
          console.error('Upload error:', error);
        },
        complete: () => {
          console.log('Upload complete');
        }
      });
    }
  }
  get f() {
    return this.productForm.controls;
  }
  

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      console.error('Form is invalid:', this.productForm.errors);
      return;
    }

    console.log('Original Form Value:', this.productForm.value);

    const formValue = {
      ...this.productForm.value,
      priceExcludingFees: parseFloat(this.productForm.value.priceExcludingFees),  
      photos: this.photos.value.map((p: { photo: string; }) => p.photo),
      keywords: this.keywords.value.map((k: { keyword: string; }) => k.keyword.trim()).filter((k: string) => k !== ''),
      store: this.currentUser?.store  
    };

    console.log('Transformed Form Submit Value:', formValue);

    if (this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, formValue).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.router.navigate(['/productsByUser']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(formValue).subscribe({
        next: () => {
          console.log('Product created successfully');
          this.router.navigate(['/productsByUser']);
        },
        error: (err) => {
          console.error('Error creating product:', err);
        }
      });
    }
  }
}
