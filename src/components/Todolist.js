import React,{useState} from "react";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck , faPen, faTrash, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
function Todolist(){

  let data = localStorage.getItem('TaskList');
  data = JSON.parse(data);
  console.log(data);
  const  [todo, addtodo] = useState(data);

    const  [newTask, setNewTask] = useState('');
    const [updateData, setUpdateData ] = useState({});

    // add new task
    const addTask = () =>{
      if(newTask)
      {
        let num = todo.length + 1;
        let tasktitle = newTask;
        let taskStatus = false;
        let createdTask = {id:num, title:tasktitle, status:taskStatus};
        addtodo([...todo, createdTask]);
        localStorage.setItem("TaskList", JSON.stringify(todo));
        setNewTask('');
      }
    }

    // delete current task
    const deleteTask = (id) =>{
      let taskList = todo.filter((elem) =>{ return elem.id!==id});
      for( let i=id-1; i<taskList.length; i++){
        // decrementing id by 1 for all items below deleted item
        taskList[i].id -= 1; 
      }
      addtodo(taskList);
      localStorage.setItem("TaskList", JSON.stringify(taskList));
      console.log("task " + id + " deleted");
    }

    // edit current task
    const editTask = (id) => {
      const tasklist = todo.filter((elem)=>{return elem.id ===id});
      console.log(tasklist[0]);
      setUpdateData(tasklist[0]);
    }

   //update the edited task
    const updateTask = () => {
      if(updateData.id)//if we dont keep this then if update is pressed again then a updateData state will be created with id:NaN
      {
      let filterdata = todo.filter((elem)=>{return elem.id !== updateData.id});
      addtodo([...filterdata, updateData]);
      let tempdata = [...filterdata, updateData];
      localStorage.setItem("TaskList", JSON.stringify(tempdata.sort((a,b)=>{return a.id>b.id?1:-1})))
      setUpdateData({});
      }
    }

    // cancel editing 
    const cancelUpdate = () =>{
      setUpdateData('')
    }

    // Mark as done
    const markdone = (id) =>{
      let newlist = todo.map((elem)=>{
        if(elem.id === id){
          return ({...elem, status:(!elem.status)})
        }
         return elem
      })
      addtodo(newlist);
      localStorage.setItem("TaskList", JSON.stringify(newlist));

    }

    return(
      <div className="container-fluid App">
          <div className="row justify-content-center">
              <div className="h4 heading col-fluid text-center align-self-center py-3">To-Do List App React-JS </div>
          </div>

          {/* Form controls */}

      {updateData.id && updateData.id ? (// if we have defined the updateData state as '' then we could have directly used updateData && updateData
        <>
          {/* add task */}
          <div className="row my-2 justify-content-center ms-1">
            <div className="col-7">
              <input className="form-control form-control-lg"
              value={updateData.title ? updateData.title: ''}
              
              onChange = {(e)=>{
                setUpdateData({
                  id:updateData.id,
                  title: e.target.value,
                  status: updateData.status
                });
              }}
              />
            </div>
            <div className="col-auto align-self-center ps-0">
              <button className="btn btn-lg btn-primary" onClick={()=>{updateTask()}}>
                Update
              </button>
            </div>
            <div className="col-auto align-self-center ps-0">
              <button className="btn btn-lg btn-danger" onClick={()=>{cancelUpdate()}}>
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
         {/* update task */}
         <div className="row my-2 justify-content-center ms-5">
            <div className="col-8 align-self-center pe-0">
              <input className="form-control form-control-lg"
              value={newTask}
              onChange = {(e)=>{setNewTask(e.target.value)}}
              />
            </div>
            <div className="col-2 px-0 ms-2">
              <button className="btn btn-lg btn-success"
               onClick={()=>{addTask()}}>
                Add Task
              </button>
            </div>
          </div>
        </>
      )}
  
          {/* Displaying task */}
          <div className="text-center">
          {todo && todo.length ? '': "No Tasks...." }
          </div>
          {todo && todo
                        .sort((a,b) =>{ return( a.id > b.id ? 1 : -1 )})
                        .map((items,index)=>{
                          return(  
                            <React.Fragment key={items.id}>
                                <div className="row col-8 mx-auto my-1 rounded py-2 taskbg">
                                    <div className={`${items.status ? 'done': ''} text-start col-lg-9 col-md-9 col-sm-8 text-break `}>
                                        <span className="tasknumber mx-2 rounded-circle px-2 py-1 border text-center">{index+1}</span>
                                        <span className="tasktitle">{items.title}</span>
                                    </div>
                                    <div className="iconswrap col-lg-3 col-md-3 col-sm-4  text-end">
                                      {/* task done button */}
                                      <span title="Task Done" className="px-2" onClick={()=>{markdone(items.id)}}><FontAwesomeIcon icon={
                                        items.status? faCircleXmark:faCircleCheck
                                      } /></span>
                                      {/* task edit button */}
                                      {items.status?null: <span title="Edit Task" className="px-2" onClick={()=>{editTask(items.id)}}><FontAwesomeIcon icon={faPen} /></span>}
                                      {/* task delete button */}
                                      <span title="Delete Task" className="px-2" onClick = {()=>{deleteTask(items.id)}}><FontAwesomeIcon icon={faTrash}/></span>                                     
                                    </div> 
                                </div>

                            </React.Fragment>
                          )
                        })}


      </div>
    )
}
export default Todolist