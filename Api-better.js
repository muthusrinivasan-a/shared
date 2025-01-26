this.isLoading = true;

// Function to fetch paginated data and append all subsequent results into the first response
const fetchPaginatedData = (baseUrl: string, limit: number) => {
  return this.http.get<any>(`${baseUrl}&limit=${limit}&offset=0`, { headers: this.headers }).pipe(
    switchMap((firstResponse) => {
      const totalCount = firstResponse._totalCount; // Total count from the first response
      const requests = [];

      // Generate requests for additional pages starting at offset = limit
      for (let offset = limit; offset < totalCount; offset += limit) {
        requests.push(this.http.get<any>(`${baseUrl}&limit=${limit}&offset=${offset}`, { headers: this.headers }));
      }

      // Combine all subsequent requests
      return forkJoin(requests).pipe(
        map((subsequentResponses) => {
          // Append all `_results` from subsequent responses into the first response `_results`
          subsequentResponses.forEach((res) => {
            firstResponse._results = firstResponse._results.concat(res._results);
          });
          return firstResponse; // Return the updated first response
        })
      );
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
    console.log('Projects:', projects); // `projects._results` contains all concatenated results
    console.log('Program Epics:', programEpics); // `programEpics._results` contains all concatenated results
    console.log('Epics:', epics); // `epics._results` contains all concatenated results
    this.isLoading = false;

    // Handle results here
    this.handleResults(projects, programEpics, epics);
  },
  error: (error) => {
    console.error('Error:', error);
    this.isLoading = false;
  }
});





this.isLoading = true;

// Function to fetch paginated data dynamically
const fetchPaginatedData = (baseUrl: string, limit: number) => {
  return this.http.get<any>(`${baseUrl}&limit=${limit}&offset=0`, { headers: this.headers }).pipe(
    switchMap((response) => {
      const totalCount = response._totalCount; // Get total count
      let allResults = [...response._results]; // Initialize with the first response's results

      const requests = [];
      // Generate requests for additional pages starting at offset = limit
      for (let offset = limit; offset < totalCount; offset += limit) {
        requests.push(this.http.get<any>(`${baseUrl}&limit=${limit}&offset=${offset}`, { headers: this.headers }));
      }

      // Combine additional requests and concatenate their _results arrays
      return forkJoin(requests).pipe(
        map((responses) => {
          responses.forEach((res) => {
            allResults = allResults.concat(res._results); // Concatenate results from each response
          });
          return allResults; // Return the final concatenated results
        })
      );
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
    console.log('Projects:', projects); // Final concatenated array of projects
    console.log('Program Epics:', programEpics); // Final concatenated array of program epics
    console.log('Epics:', epics); // Final concatenated array of epics
    this.isLoading = false;

    // Handle results here
    this.handleResults(projects, programEpics, epics);
  },
  error: (error) => {
    console.error('Error:', error);
    this.isLoading = false;
  }
});
