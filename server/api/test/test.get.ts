export default defineEventHandler(async (event) => {
	    const { apiUrl } = useRuntimeConfig(event).public;
	return { test: "Super test", apiUrl}
})