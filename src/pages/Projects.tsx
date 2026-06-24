GET /projects
useEffect(() => {

    axios
        .get(
            `http://localhost:3000/projects/${id}`
        )
        .then((res)=>{

            setServers(res.data.servers);
            setSwitches24(res.data.switches24);
            setSwitches48(res.data.switches48);
            setPoeSwitches(res.data.poeSwitches);
            setRackSize(res.data.rackSize);

        });

}, []);