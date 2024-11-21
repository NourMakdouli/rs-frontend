import { Pipe, PipeTransform } from '@angular/core';
import { Article } from 'src/app/core/models/article';

@Pipe({
  name: 'isDraftFilter'
})
export class IsDraftFilterPipe implements PipeTransform {

  transform(articles: Article[], isDraft: boolean): Article[] {
    return articles.filter(article => article.isDraft === isDraft);
  }
}
