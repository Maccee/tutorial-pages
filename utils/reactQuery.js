import React, { useState, useEffect } from 'react';

const DatahubComponent = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Authentication
                const authBody = new URLSearchParams();
                authBody.append("grant_type", "password");
                authBody.append("client_id", "datahub-api");
                authBody.append("client_secret", process.env.REACT_APP_DATAHUB_CLIENT_SECRET);
                authBody.append("username", process.env.REACT_APP_DATAHUB_USERNAME);
                authBody.append("password", process.env.REACT_APP_DATAHUB_PASSWORD);

                const authResponse = await fetch("https://iam-datahub.visitfinland.com/auth/realms/Datahub/protocol/openid-connect/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: authBody,
                });

                const { access_token } = await authResponse.json();

                // GraphQL Query
                const graphqlQuery = {
                    query: `
                        query GetGroupedProducts {
                            groupedProducts(args: {publishing_id: "3dd3c135-2805-4f37-b475-82b10145aea6"}) {
                                id
                                productInformations(where: { language: { _eq: fi } }) {
                                    name
                                    description
                                }
                                postalAddresses {
                                    location
                                    postalCode
                                    streetName
                                    city
                                }
                            }
                        }
                    `
                };

                const dataResponse = await fetch("https://api-datahub.visitfinland.com/graphql/v1/graphql", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`
                    },
                    body: JSON.stringify(graphqlQuery),
                });

                const jsonData = await dataResponse.json();
                setData(jsonData.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Datahub Grouped Products</h2>
            {/* Render your data here */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DatahubComponent;
