export const fetchRepositories = async () => {
    try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        if (!response.ok) {
            if (response.status >= 500) {
                throw new Error("INTERNAL_SERVER_ERROR");
            } else if (response.status >= 400 && response.status < 500) {
                throw new Error("BAD_REQUEST");
            } else {
                throw new Error("UNKNOWN_ERROR");
            }
        }
        const data = await response.json();
        const allRepos: Repo[] = data.data; // Server returns { success, count, data: [...] }

        // Filter for projects with 'react' topic
        const filtered = allRepos.filter(r => r.topics?.includes('react'));
        setReactProjects(filtered);
    } catch (err: any) {
        setError(getErrorMessage(err));
    } finally {
        setLoading(false);
    }
};