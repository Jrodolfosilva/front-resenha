
export  class API {
    constructor() {
        this.host = "http://127.0.0.1:8000/api/v1/";
        this.rotaImagens = "http://127.0.0.1:8000";
        this.loginADM = "user/singin/user/";
        this.createUserADM = "user/create/user/";
        this.loginBancada = "login/torneio/bancada/";
        this.createTorneio = "create/torneio/";
        this.encerrarTorneio = "create/torneio/encerrar/";
        this.buscaTorneio = "create/torneio/consulta/";
        this.createQuadra = "create/quadra/";
        this.buscaQuadra = "create/quadra/consulta/";
        this.createEquipe = "create/equipe/";
        this.buscarEquipe = "create/equipe/consultar/";
        this.createJogo = "create/jogo/";
        this.buscarJogo = "create/jogo/consultar/";
        this.encerrarJogo = "create/jogo/encerrar/"
        this.buscarUsuarios = "create/quadra/users/";
    }

    AuthClass = class {
        constructor () {
            this.api = new API();
        };

        async tokenLogin (email, senha) {
            try {
                const request = await fetch(this.api.host+this.api.loginADM, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        "email" : email,
                        "password" : senha
                    })
                });
                
                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return false;
                }
    
            } catch (error) {
                return false;
            }
        };

        async tokenBancada (email, senha) {
            try {
                const request = await fetch(this.api.host+this.api.loginBancada, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        "email" : email,
                        "password" : senha
                    })
                });
    
                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request;
                }
            } catch (error) {
                return false;
            }
        };
    }

    TorneioClass = class {
        constructor() {
            this.api = new API();
        };

        async torneioCreate (torneio, token) {

            try {
                const request = await fetch(this.api.host + this.api.createTorneio, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    body: torneio
                });
    
                if (request.status == 201) {
                    const data = await request.json();
                    return data;
                } else {
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };

        async torneioEditar (torneio,token,id) {

            try {
                const request = await fetch(this.api.host+this.api.createTorneio + "?torneio="+id, {
                    method: "PUT",
                    headers: {
                        "Authorization" : "Bearer " + token,
                    },
                    body: torneio
                });

                if(request.status==201){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                console.log(error)
                return false;
            }
        };

        async torneioDeletar (token, torneio) {
            try {
                const request = await fetch(this.api.host + this.api.createTorneio + "?torneio=" + torneio, {
                    method: "DELETE",
                    headers: {
                        "Authorization" : "Bearer " + token
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async torneioEncerrar (token, torneio) {
            try {
                const request = await fetch(this.api.host + this.api.encerrarTorneio + "?torneio=" + torneio, {
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer " + token
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async torneioBuscar(torneio_id) {
            try {
                const request = await fetch(this.api.host + this.api.buscaTorneio, {
                    method: "GET",
                });

                if(request.status==200){
                    const data = await request.json();
                    let newData = data.map(item => {
                        return {
                            ...item,
                            logo: this.api.rotaImagens+item.logo
                        }
                    })
                    return newData.reverse();
                } else {
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };
    }

    QuadraClass = class {
        constructor () {
            this.api = new API();
        };

        async createQuadra (token, quadra, link, torneio_id) {
            try {
                const request = await fetch(this.api.host + this.api.createQuadra, {
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer " + token,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "quadra" : quadra,
                        "link" : link,
                        "torneio" : torneio_id
                    })
                });
    
                if(request.status==201){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };

        async editarQuadra (token, quadra_id, quadra, link, torneio_id) {
            try {
                const request = await fetch(this.api.host + this.api.createQuadra + "?quadra=" + quadra_id, {
                    method: "PUT",
                    headers: {
                        "Authorization" : "Bearer " + token,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "quadra" : quadra,
                        "link" : link,
                        "torneio" : torneio_id
                    })
                });

                if (request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };

        async deleteQuadra (quadra_id, torneio_id, token) {
            try {
                const request = await fetch(this.api.host + this.api.createQuadra + "?quadra=" + quadra_id + "&torneio=" + torneio_id, {
                    method: "DELETE",
                    headers: {
                        "Authorization" : "Bearer " + token
                    }
                });
    
                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };

        async buscarQuadra (torneio_id) {
            try{
                const request = await fetch(this.api.host + this.api.buscaQuadra + "?torneio=" + torneio_id, {
                method: "GET"
                });
                if (request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            }catch (error){
                return false;
            }
        };
    
        async buscarUsuarioQuadra (token, torneio_id) {
            try {
                const request = await fetch(this.api.host + this.api.buscarUsuarios + "?torneio=" + torneio_id, {
                    method: "GET",
                    headers: {
                        "Authorization" : "Bearer " + token
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        
    }

    EquipeClass = class {
        constructor () {
            this.api = new API();
        };

        async createEquipe (token, torneio_id, equipe) {
            try {
                const request = await fetch(this.api.host + this.api.createEquipe, {
                    method: "POST",
                    headers: {
                        "Authorization" : "Bearer " + token,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "torneio" : torneio_id,
                        "equipe" : equipe
                    })
                });

                if(request.status==201){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        };

        async editarEquipe (torneio_id, equipe_id, token, equipe) {
            try {
                const request = await fetch(this.api.host + this.api.createEquipe + "?torneio=" + torneio_id + "&equipe=" + equipe_id, {
                    method: "PUT",
                    headers: {
                        "Authorization" : "Bearer " + token,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "equipe" : equipe
                    })
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }
    
        async deleteEquipe (torneio_id, equipe_id, token) {
            try {
                const request = await fetch(this.api.host + this.api.createEquipe + "?torneio=" + torneio_id + "&equipe=" + equipe_id, {
                    method: "DELETE",
                    headers: {
                        "Authorization" : "Bearer " + token,
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }
    
        async buscarEquipe (torneio_id) {
            try {
                const request = await fetch(this.api.host + this.api.buscarEquipe + "?torneio=" + torneio_id, {
                    method: "GET",
                });
    
                if (request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }
    };

    JogoClass = class {
        constructor () {
            this.api = new API();
        }

        async createJogo (token, equipe_A, equipe_B) {
            try {
                const request = await fetch(`${this.api.host}${this.api.createJogo}`, {
                    method: "POST",
                    headers: {
                        "Authorization" : `Bearer ${token}`,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "equipe_A" : equipe_A,
                        "equipe_B" : equipe_B
                    })
                });

                if (request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async editarJogo (jogo_id, token, equipe_A, equipe_B) {
            try {
                const request = await fetch(this.api.host + this.api.createJogo + "?jogo=" + jogo_id, {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Bearer ${token}`,
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        "equipe_A" : equipe_A,
                        "equipe_B" : equipe_B
                    })
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async deleteJogo (jogo_id, token) {
            try {
                const request = await fetch(`${this.api.host}${this.api.createJogo}?jogo=${jogo_id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization" : `Bearer ${token}`,
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async encerrarJogo (id_torneio,id_quadra,jogo_id, token) {
            try {
                const request = await fetch(`${this.api.host}${this.api.encerrarJogo}?torneio=${id_torneio}&quadra=${id_quadra}&jogo=${jogo_id}`, {
                    method: "POST",
                    headers: {
                        "Authorization" : `Bearer ${token}`,
                    }
                });

                if(request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }

        async buscarJogo (torneio_id, quadra_id, jogo_id) {
            try {
                const request = await fetch(`${this.api.host}${this.api.buscarJogo}?torneio=${torneio_id}&quadra=${quadra_id}`, {
                    method: "GET",
                    cache: "no-store",
                });

                if (request.status==200){
                    const data = await request.json();
                    return data;
                }else{
                    return request.status;
                }
            } catch (error) {
                return false;
            }
        }
    }
}
