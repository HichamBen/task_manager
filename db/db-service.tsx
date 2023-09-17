import SQLite, {WebsqlDatabase} from 'react-native-sqlite-2';
import {CheklistProps, TaskProps} from '../context/TaskContext';

export const getDBConnection = () => {
  return SQLite.openDatabase('task_manger', '1.0');
};

export const createTables = async (db: WebsqlDatabase) => {
  // create table if not exists
  const queryTasks = `CREATE TABLE IF NOT EXISTS tasks (
      taskId TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      dueTime TEXT,
      isOver INTERGER DEFAULT 0 NOT NULL,
      isCompleted INTERGER DEFAULT 0 NOT NULL
   ) WITHOUT ROWID`;
  const queryCheckList = `CREATE TABLE IF NOT EXISTS checkList (
      checkListItemId TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      isChecked INTERGER DEFAULT 0 NOT NULL,
      taskId TEXT NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks (taskId)
      ) WITHOUT ROWID`;

  db.transaction(txn => {
    txn.executeSql(queryTasks, [], transaction => {
      transaction.executeSql(queryCheckList, []);
    });
  });
};

export const createTask = async (db: WebsqlDatabase, taskData: TaskProps) => {
  let {taskId, title, description, dueTime, checkList} = taskData;

  let params = [
    taskId,
    title,
    description,
    dueTime ? dueTime.join('-') : 'NULL',
  ];
  // create table if not exists
  const queryTask = `INSERT INTO tasks (taskId,title, description, dueTime) 
   VALUES (?, ?, ?, ?)`;

  db.transaction(txn => {
    txn.executeSql(
      queryTask,
      params,
      (transaction, res) => {
        console.log('Insert data to tasks table', res);
        if (checkList?.length) {
          let checkParams: string[] = [];

          checkList.forEach(list => {
            checkParams.push(
              list.checkListItemId,
              list.content,
              list.isChecked ? '1' : '0',
              taskId,
            );
          });

          const queryCheckList = `INSERT INTO checkList (checkListItemId, content, isChecked, taskId) 
              VALUES ${checkList.map(__list => '(?, ?, ?, ?)').join(',')}`;

          transaction.executeSql(
            queryCheckList,
            checkParams,
            (__, result) => {
              console.log('Insert data to checkList table', result);
            },
            (__, err) => {
              console.log('Insert error in checkList table', err);
              return false;
            },
          );
        }
      },
      (__, error) => {
        console.log('Insert error in tasks table', error);
        return false;
      },
    );
  });
};

export const deleteTask = async (db: WebsqlDatabase, taskId: string) => {
  // change the order because you cannot remove a parent row before
  // his childs
  let params = [taskId];

  const query = `DELETE FROM checkList
   WHERE taskId = ?`;

  db.transaction(txn => {
    txn.executeSql(
      query,
      params,
      (transaction, res) => {
        console.log('Delete checkList table', res);
        transaction.executeSql(
          `DELETE FROM tasks
        WHERE taskId=?`,
          params,
          (__, result) => {
            console.log('Delete tasks table', result);
          },
          (__, err) => {
            console.log('Delete error in tasks table', err);
            return false;
          },
        );
      },
      (__, error) => {
        console.log('Delete error in checkList table', error);
        return false;
      },
    );
  });
};

export const updateTask = (db: WebsqlDatabase, payload: TaskProps) => {
  let checkList = payload.checkList;

  if (checkList) {
    checkList.forEach(item => {
      db.transaction(txn => {
        txn.executeSql(
          `UPDATE checkList 
           SET content = ?,
               isChecked = ?
           WHERE checkListItemId = ?`,
          [item.content, item.isChecked ? '1' : '0', item.checkListItemId],
          (__, result) => {
            console.log('Update checkList table', result);
          },
          (__, err) => {
            console.log('Update error in checkList table', err);
            return false;
          },
        );
      });
    });
  }

  db.transaction(txn => {
    txn.executeSql(
      `UPDATE tasks 
       SET title = ? ,
           description = ? ,
           dueTime = ? ,
           title = ? ,
           isOver = ? ,
           isCompleted = ?
       WHERE taskId = ?
      `,
      [
        payload.title ? payload.title : 'Null',
        payload.description ? payload.description : 'Null',
        payload.dueTime ? payload.dueTime.join('-') : 'Null',
        payload.isOver ? '1' : '0',
        payload.isCompleted ? '1' : '0',
        payload.taskId,
      ],
      (__, result) => {
        console.log('Update tasks table', result);
      },
      (__, err) => {
        console.log('Update error in tasks table', err);
        return false;
      },
    );
  });
};

export const taskOver = (db: WebsqlDatabase, taskId: string) => {
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE tasks 
       SET isOver = ?   
       WHERE taskId = ?
      `,
      [1, taskId],
      (__, result) => {
        console.log('Task Over tasks table', result);
      },
      (__, err) => {
        console.log('Task Over error in tasks table', err);
        return false;
      },
    );
  });
};
export const updateCheckList = (
  db: WebsqlDatabase,
  payload: {itemId: string; isChecked: boolean},
) => {
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE checkList 
       SET isChecked = ?
       WHERE checkListItemId=?`,
      [payload.isChecked ? '1' : '0', payload.itemId],
      (__, result) => {
        console.log('Update checkList table', result);
      },
      (__, err) => {
        console.log('Update error in checkList table', err);
        return false;
      },
    );
  });
};

export const insertToCheckList = (
  db: WebsqlDatabase,
  checkListItemId: string,
  taskId: string,
) => {
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO checkList (checkListItemId, content,taskId) 
      VALUES (?,?,?)`,
      [checkListItemId, 'first', taskId],
      (__, result) => {
        console.log('Insert a row to checkList table', result);
      },
      (__, err) => {
        console.log('Insert a row error in checkList table', err);
        return false;
      },
    );
  });
};

export const delteFromCheckList = (db: WebsqlDatabase, itemId: string) => {
  db.transaction(txn => {
    txn.executeSql(
      'DELETE FROM checkList WHERE checkListItemId=?',
      [itemId],
      (__, result) => {
        console.log('Delete from checkList table', result);
      },
      (__, err) => {
        console.log('Delete error from checkList table', err);
        return false;
      },
    );
  });
};

export const getTasks = async () => {
  const database = getDBConnection();
  const checkList = await getChecklistOnly(database);
  const tasks = await getTasksOnly(database);

  return tasks.map(task => {
    let list = checkList.filter(item => item.taskId === task.taskId);
    return {...task, checkList: list};
  });
};

export const getTasksOnly = async (
  db: WebsqlDatabase,
): Promise<TaskProps[]> => {
  const query = 'SELECT * FROM tasks';

  return new Promise(resolve =>
    db.transaction(txn => {
      txn.executeSql(
        query,
        [],
        (__, result) => {
          let tasks = [];
          for (let i = 0; i < result.rows.length; i++) {
            const {dueTime, isOver, isCompleted} = result.rows.item(i);
            tasks.push({
              ...result.rows.item(i),
              dueTime: dueTime && dueTime.split('-'),
              isOver: isOver ? true : false,
              isCompleted: isCompleted ? true : false,
            });
          }
          resolve(tasks);
        },
        (__, err) => {
          console.log('Get all error from checkList table', err);
          return false;
        },
      );
    }),
  );
};

export const getChecklistOnly = async (
  db: WebsqlDatabase,
): Promise<(CheklistProps & {taskId: string})[]> => {
  const query = 'SELECT * FROM checkList';

  return new Promise(resolve =>
    db.transaction(txn => {
      txn.executeSql(
        query,
        [],
        (__, result) => {
          let checkList = [];
          for (let i = 0; i < result.rows.length; i++) {
            const {isChecked} = result.rows.item(i);
            checkList.push({
              ...result.rows.item(i),
              isChecked: isChecked ? true : false,
            });
          }
          resolve(checkList);
        },
        (__, err) => {
          console.log('Get all error from checkList table', err);
          return false;
        },
      );
    }),
  );
};

export const completedTask = (db: WebsqlDatabase, taskId: string) => {
  db.transaction(txn => {
    txn.executeSql(
      `UPDATE tasks 
       SET isCompleted =  1
       WHERE taskId = ?`,
      [taskId],
      (__, res) => {
        console.log('Compelete tasks', res);
      },
      error => {
        console.log('Error in Compelete tasks table', error);
        return false;
      },
    );
  });
};

export const dropTables = async (db: WebsqlDatabase) => {
  db.transaction(txn => {
    txn.executeSql(
      'DROP TABLE IF EXISTS checkList',
      [],
      (transaction, result) => {
        console.log('Drop checkList table', result);
        transaction.executeSql(
          'DROP TABLE IF EXISTS tasks',
          [],
          (__, res) => {
            console.log('Drop table tasks', res);
          },
          err => {
            console.log('Error in Drop tasks table', err);
            return false;
          },
        );
      },
      error => {
        console.log('Error in Drop checkList table', error);
        return false;
      },
    );
  });
};