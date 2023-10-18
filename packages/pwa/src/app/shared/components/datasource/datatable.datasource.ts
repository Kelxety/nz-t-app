import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, Subject, catchError, of, takeUntil } from "rxjs";

export class DatatableDataSource extends DataSource<any> {
    private $pageSize = 25;
    private cachedData: any[] = [];
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<any[]>(this.cachedData);
    private complete$ = new Subject<void>();
    private disconnect$ = new Subject<void>();
    totalItem = 0
    private loadingSubject = new BehaviorSubject<boolean>(false);
    hasNext = true

    constructor(private service: any) {
        super();
    }

    completed(): Observable<void> {
        return this.complete$.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        this.setup(collectionViewer);
        return this.dataStream;
    }

    disconnect(): void {
        this.disconnect$.next();
        this.disconnect$.complete();
    }

    private setup(collectionViewer: CollectionViewer): void {
        this.fetchPage(1);
        collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
            if (this.cachedData.length >= this.totalItem) {
                this.complete$.next();
                this.complete$.complete();
            } else {
                const endPage = this.getPageForIndex(range.end);
                this.fetchPage(endPage + 1);
            }
        });
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.$pageSize);
    }

    fetchSearch(page: number, params: object = { page: page, pagination: true, pageSize: 30, q: '' }): void {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);

        this.service
            .fulltextFilter(params)
            .pipe(catchError(() => of({ results: [] })))
            .subscribe((res) => {
                console.log(res, 'res')
                this.totalItem = res.totalItems
                this.cachedData.splice(page * this.$pageSize, this.$pageSize, ...res.data);
                this.dataStream.next(this.cachedData);
            });
    }

    private fetchPage(page: number, params: object = { page: page, pagination: true, pageSize: 30 }): void {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);

        this.service
            .list(params)
            .pipe(catchError(() => of({ results: [] })))
            .subscribe((res) => {
                console.log(res, 'res')
                this.totalItem = res.totalItems
                this.cachedData.splice(page * this.$pageSize, this.$pageSize, ...res.data);
                this.dataStream.next(this.cachedData);
            });
    }
}
