import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { Button, Modal } from 'react-bootstrap';
const ShowInventario = () => {
    const url='http://127.0.0.1:8000/api/inventario';
    const urlCategoria = 'http://127.0.0.1:8000/api/categoria';
    const urlSucursales = 'http://127.0.0.1:8000/api/sucursales';
    const urlPostInventario = 'http://127.0.0.1:8000/api/inventario-add';
    const [inventarios,setInventarios] = useState([]);
    const [adyacentes,setAdyacentes] = useState([]);
    const [categorias,setCategorias] = useState([]);
    const [sucursales,setSucursales] = useState([]);
    const [nombre_categoria,setNombre_categoria] = useState('');
    const [id_invetario,setId_inventario] = useState('');
    const [nombre_articulo,setNombre_articulo] = useState('');
    const [stock,setStock] = useState('');
    const [id_categoria,setId_categoria] = useState('');
    const [id_sucursal,setId_sucursal] = useState('');
    const [codigoBarra,setCodigoBarra] = useState('');
    const urlValidar=`http://127.0.0.1:8000/api/inventario/${encodeURIComponent(codigoBarra)}`;
    const urlPutInventario = `http://127.0.0.1:8000/api/inventario/${encodeURIComponent(id_invetario)}`;
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('Registro de productos');
    const [opcion, setOpcion] = useState(1);
    useEffect( ()=>{
        getInventarios();
        getCategorias();
        getSucursales();
    },[]);
    

    const getInventarios = async ()=>{
        const response = await axios.get(url);
        setInventarios(response.data);
    }
    const getCategorias = async ()=>{
        const response2 = await axios.get(urlCategoria);
        setCategorias(response2.data);
    }
    const getSucursales = async ()=>{
        const response3 = await axios.get(urlSucursales);
        setSucursales(response3.data);
    }


    const validar = ()=>{
        var parametros;
        var metodo;
        if (codigoBarra.trim() === '') {
            show_alerta('Escribe el codigo de barra','warning');
        }else if (nombre_articulo.trim() === '') {
            show_alerta("Escribe El nombre producto",'warning');
        }else if (stock.trim() === '' ) {
            show_alerta('Ingrese la cantidad de stock','warning');
        }else if (id_categoria < 1) {
            show_alerta('Seleccione la categoria','warning');
        }else if (id_sucursal <1) {
            show_alerta('Seleccione la sucursal','warning');
        } else {
            parametros = {CodigoBarra:codigoBarra.trim(),Nombre_articulo:nombre_articulo.trim(),Stock:stock,
                          id_sucursal:id_sucursal,id_categoria:id_categoria
            };
            metodo='POST';
            doRequest(metodo,parametros);
        }

        
    }

    const validarEdit = ()=>{
        var parametros3;
        var metodo3;
        if (codigoBarra.trim() === '') {
            show_alerta('Escribe el codigo de barra','warning');
        }else if (nombre_articulo.trim() === '') {
            show_alerta("Escribe El nombre producto",'warning');
        }else if (stock === '' ) {
            show_alerta('Ingrese la cantidad de stock','warning');
        }else if (id_categoria < 1) {
            show_alerta('Seleccione la categoria','warning');
        }else if (id_sucursal <1) {
            show_alerta('Seleccione la sucursal','warning');
        } else {

            parametros3 = {id_invetario:id_invetario,CodigoBarra:codigoBarra.trim(),Nombre_articulo:nombre_articulo.trim(),Stock:stock,
                id_sucursal:id_sucursal,id_categoria:id_categoria
            };
            metodo3='PUT';
            doPut(metodo3,parametros3);
            console.log(id_invetario);
        }

        
    }

    const handleBlur = ()=>{
        var parametros2
        var metodo2
        parametros2 = {CodigoBarra:codigoBarra.trim()};
        metodo2='GET';
        doGet(metodo2,parametros2);
    }

    const handleModal = () => {
        setShowModal(!showModal);
      };

    const limpiarForm = ()=>{
        setId_inventario('');
        setCodigoBarra('');
        setNombre_articulo('');
        setStock('');
        setId_categoria(0);
        setId_sucursal(0);
    }

    const doGet = async(metodo,parametros) =>{
        await axios({method:metodo,url:urlValidar,data:parametros}).then(function (response) {
            var tipo = response.data.mensaje;
            console.log(tipo);
            if (tipo === '1') {
                show_alerta('Producto ya registrado, agregue unidades','error');
                limpiarForm();
            }else{
                show_alerta('No está registrado este código de barra, prosiga','success');
                document.getElementById('Nombre').focus();
            }
        })
        .catch(function (error) {
            show_alerta('Error en la solicitud','error'); 
            console.log(error);
        });
    }

    const doRequest = async(metodo,parametros) =>{
        await axios({method:metodo,url:urlPostInventario,data:parametros}).then(function (response) {
            var tipo = response.data[1];
            var msj = response.data[0];
            if (tipo !== '') {
                show_alerta('Registro agregado exitosamente','success');
                getInventarios();
            }
        })
        .catch(function (error) {
            show_alerta('Error en la solicitud','error'); 
            console.log(error);
        });
    }

    const doPut = async(metodo,parametros) =>{
        await axios({method:metodo,url:urlPutInventario,data:parametros}).then(function (response) {
            var tipo = response.data[1];
            var msj = response.data[0];
            if (tipo !== '') {
                show_alerta('Registro Editado exitosamente','success');
                getInventarios();
            }
        })
        .catch(function (error) {
            show_alerta('Error en la solicitud','error'); 
            console.log(error);
        });
    }

    const fillModal = (op,id,cod,name,stock,categoria,sucursal)=>{
        if (op === 2) {
            setTitle('Edición de productos');
            document.getElementById('codigo').removeAttribute('onBlur');
            document.getElementById('btnGuardar').classList.add('d-none');
            document.getElementById('Editar').classList.remove('d-none');
            document.getElementById('Cancelar').classList.remove('d-none');
            document.getElementById('Limpiar').classList.add('d-none');
            setId_inventario(id);
            setCodigoBarra(cod);
            setNombre_articulo(name);
            setStock(stock);
            setId_categoria(categoria);
            setId_sucursal(sucursal);
            

        } else {
            limpiarForm();
            setTitle('Registro de productos');
            document.getElementById('btnGuardar').classList.remove('d-none');
            document.getElementById('Editar').classList.add('d-none');
            document.getElementById('Cancelar').classList.add('d-none');
            document.getElementById('Limpiar').classList.remove('d-none');
        }
    }
  return (
    <div className='App'>
        <div className='container-fluid mt-5'>
        <div className='row'>
            <div className='col-md-4 col-sm-12 p-5 bg-white rounded-end'>
            <h3>{title}</h3>
                    <div className='d-flex flex-column'>
                        <input type='hidden' id='id'></input>
                        
                        <div className='input-group mb-3 mt-3'>
                            <span className='input-group-text'><i class="fa fa-code" aria-hidden="true"></i></span>
                            <input type='text' id='codigo' className='form-control' placeholder='Codigo barras' value={codigoBarra}
                            onChange={(e)=>setCodigoBarra(e.target.value)} onBlur={handleBlur}></input>
                        </div>
                        <div className='input-group mb-3 mt-3'>
                            <span className='input-group-text'><i class="fa fa-address-book" aria-hidden="true"></i></span>
                            <input type='text' id='Nombre' className='form-control' placeholder='Nombre producto' value={nombre_articulo}
                            onChange={(e)=>setNombre_articulo(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3 mt-3'>
                            <span className='input-group-text'><i class="fa fa-columns" aria-hidden="true"></i></span>
                            <input type='text' id='Nombre' className='form-control' placeholder='Stock' value={stock}
                            onChange={(e)=>setStock(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3 mt-3'>
                            <select class='form-select' value={id_categoria} onChange={(e)=>setId_categoria(e.target.value)}>
                                <option selected>Categorias:</option>
                                {categorias.map((categoria,id)=>(
                                    <option key={id} value={categoria.id_categoria}>{categoria.Nombre_categoria}</option>        
                                ))
                                }
                                
                            </select>
                        </div>
                        <div className='input-group mb-3 mt-3'>
                            <select class='form-select' value={id_sucursal} onChange={(e)=>setId_sucursal(e.target.value)}>
                                <option selected>Sucursales:</option>
                                {sucursales.map((sucursal,id)=>(
                                    <option key={id} value={sucursal.id_sucursal}>{sucursal.NombreSucursal}</option>        
                                ))
                                }
                                
                            </select>
                        </div>
                        <div className='d-flex w-100'>
                            <button className='btn btn-success w-100' id="btnGuardar" onClick={()=>validar()}>
                                <i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar
                            </button>
                        </div>
                        <div className='d-flex w-100 mt-2'>
                            <button className='btn btn-warning w-100 d-none' id="Editar" onClick={()=>validarEdit()}>
                                <i class="fa fa-trash-o" aria-hidden="true"></i> Editar
                            </button>
                        </div>
                        <div className='d-flex w-100 mt-2'>
                            <button className='btn btn-dark w-100 d-none'id='Cancelar' onClick={()=>fillModal(1)}>
                                <i class="fa fa-trash-o" aria-hidden="true"></i> Cancelar Edicion
                            </button>
                        </div>
                        <div className='d-flex w-100 mt-2'>
                            <button className='btn btn-dark w-100' id='Limpiar' onClick={()=>limpiarForm()}>
                                <i class="fa fa-trash-o" aria-hidden="true"></i> Limpiar
                            </button>
                        </div>
                    </div>
            </div>
            <div className='col-md-8 col-sm-12'>
                
            <div className='table-responsive rounded-top'>
                        <table className='table table-hover table-bordered bg-white '>
                            <thead className='bg-dark text-light'>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre Articulo</th>
                                    <th>Barra</th>
                                    <th>Stock</th>
                                    <th>Categoria</th>
                                    <th>Sucursal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {inventarios.map((inventario,id)=>(
                                    <tr key={inventario.id_invetario}>
                                        <td>{inventario.id_inventario}</td>
                                        <td>{inventario.Nombre_articulo}</td>
                                        <td>{inventario.CodigoBarra}</td>
                                        <td>{inventario.Stock} U</td>
                                        <td>{inventario.Nombre_categoria}</td>
                                        <td>{inventario.NombreSucursal}</td>
                                        <td>
                                        <button className='btn btn-warning' onClick={(()=> fillModal(2,inventario.id_inventario,inventario.CodigoBarra,inventario.Nombre_articulo,inventario.Stock,inventario.id_categoria,inventario.id_sucursal))}>
                                                <i className="fa-solid fa-edit" aria-hidden="true"></i> Editar
                                        </button>
                                        </td>
                                    </tr>
                                ))

                                }
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>




            <div className='row mt-5 ms-3'>
                <div className='col-md-6'>
                
                </div>
            </div>
            <div className='row mt-3'>
                 <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    
                 </div>
            </div>
        </div>
        
    </div>
  )
}

export default ShowInventario