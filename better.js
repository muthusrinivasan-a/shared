this.isLoading = true;

// Function to fetch paginated data
const fetchPaginatedData = (baseUrl: string, limit: number) => {
  return this.http.get<any>(`${baseUrl}&limit=${limit}&offset=0`, { headers: this.headers }).pipe(
    switchMap((response) => {
      const totalCount = response._totalCount; // Use total count from the first response
      const requests = [];

      // Start at offset = limit for subsequent requests
      for (let offset = limit; offset < totalCount; offset += limit) {
        requests.push(this.http.get<any>(`${baseUrl}&limit=${limit}&offset=${offset}`, { headers: this.headers }));
      }

      // Combine the initial response and all subsequent requests
      return forkJoin([of(response), ...requests]).pipe(map((results) => results.flatMap(res => res.results || res))); // Flatten all results
    })
  );
};

// Define the base URLs for each request
const getProjectsUrl = `/clarity/ppm/rest/v1/projects?fields=code,name,manager,...`;
const getProgramEpicsUrl = `/clarity/ppm/rest/v1/custVzEpics?fields=code,name,...`;
const getEpicsUrl = `/clarity/ppm/rest/v1/custVzFeatures?fields=code,name,...`;

// Fetch paginated data for each API with different limits
const getProjects = fetchPaginatedData(getProjectsUrl, 200); // Limit = 200
const getProgramEpics = fetchPaginatedData(getProgramEpicsUrl, 500); // Limit = 500
const getEpics = fetchPaginatedData(getEpicsUrl, 500); // Limit = 500

// Perform forkJoin after all API calls are prepared
forkJoin([getProjects, getProgramEpics, getEpics]).subscribe({
  next: ([projects, programEpics, epics]) => {
    console.log('Projects:', projects);
    console.log('Program Epics:', programEpics);
    console.log('Epics:', epics);
    this.isLoading = false;

    // Handle results here
    this.handleResults(projects, programEpics, epics);
  },
  error: (error) => {
    console.error('Error:', error);
    this.isLoading = false;
  }
});
