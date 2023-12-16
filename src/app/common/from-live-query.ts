import { LiveQuery } from 'remult'
import { Observable } from 'rxjs'

export function fromLiveQuery<T>(q: LiveQuery<T>) {
  return new Observable<T[]>((sub) =>
    q.subscribe(({ items }) => sub.next(items))
  )
}
