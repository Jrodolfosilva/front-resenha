type Data = {
    torneio:string;
    celular:string;
    file:FileList
}

type Quadra ={
    quadra: any,
    torneio: any|null,
    link:any
}

type Equipe = {
    torneio:string | null,
    equipe:string | null
}

type RemoverEquipe = {
    torneio:string | null;
    equipe:string | null;
    token:string | null
}

type RemoverQuadra = {
    id_torneio:string | null;
    id:string| null;
    token:string
}

export class Requests {


    async LoginADM (path:string){

    };

    async LoginBANCADA (path:string){

    };

    async CriarTorneio(data:FormData,token:string){

        const response = await fetch('http://127.0.0.1:8000/api/v1/create/torneio/', {
            method:"POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data
        });        

        return response.json()
    };
    
    
    
    /*Quadra */
    async CriarQuadra(quadra:Quadra,token:string){

        const response = await fetch('http://127.0.0.1:8000/api/v1/create/quadra/', {
            method:"POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(quadra)
        });

        return response.json()
    }

    
    async RemoverQuadra(quadra:RemoverQuadra){

       try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/create/quadra/?quadra=${quadra.id}&torneio=${quadra.id_torneio}`, {
            method:"DELETE",
            headers: {
                "Authorization": `Bearer ${quadra.token}`
            }
        });

        return response.json()
       } catch (error) {
        return false
       }
    }
    async ListarQuardas(idTorneio:string ){

        const response = await fetch(`http://127.0.0.1:8000/api/v1/create/quadra/consulta/?torneio=${idTorneio}`, {
            method:"GET",
            headers: {
                "Content-Type":'application/json'
            }
        });

        return response.json()
    }

    /*Equipe */
    async CriarEquipe(Equipe:Equipe,token:string){

        const response = await fetch('http://127.0.0.1:8000/api/v1/create/equipe/', {
            method:"POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(Equipe)
        });

        return response.json()
    }

    async ListarEquipes(id:string){

        const response = await fetch(`http://127.0.0.1:8000/api/v1/create/equipe/consultar/?torneio=${id}`, {
            method:"GET",
            headers: {
                "Content-Type":'application/json'
            }
        });

        return response.json()
    }
    async RemoverEquipe(data:RemoverEquipe){

        const response = await fetch(`http://127.0.0.1:8000/api/v1/create/equipe/?torneio=${data.torneio}&equipe=${data.equipe}`, {
            method:"DELETE",
            headers: {
                "Authorization": `Bearer ${data.token}`
            }
        });

        return response.json()
    }


    async ListarTorneios (){

        const response = await fetch("http://127.0.0.1:8000/api/v1/create/torneio/consulta/",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const data = await response.json()


        return data
    }



}






