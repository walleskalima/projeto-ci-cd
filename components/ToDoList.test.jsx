import { TouchableOpacity } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TodoList } from './ToDoList';

describe('<TodoList/>', () => {
    let getByTestId;
    let getByText;
    let queryByTestId;
    let UNSAFE_getAllByType;
    let queryByText;

    beforeEach(() => {
        ({
            getByTestId,
            getByText,
            queryByText,
            getAllByText,
            queryByTestId,
            UNSAFE_getAllByType,
        } = render(<TodoList initialTodos={[{ text: 'Tarefa 1', done: false }]} />));
    });

    test('deve adicionar uma nova tarefa', () => {
        const inputNovaTarefa = getByTestId('input-new');
        const botaoAdicionar = getByTestId('button-add');

        fireEvent.changeText(inputNovaTarefa, 'Nova Tarefa');
        fireEvent.press(botaoAdicionar);

        expect(getByText('Nova Tarefa')).toBeTruthy();
        expect(getByTestId('todo-1')).toBeTruthy();
        expect(inputNovaTarefa.props.value).toBe('');
        expect(getByText('Andamento')).toBeTruthy();
    });


    test('deve remover uma tarefa da lista', async () => {
        const botaoRemover = getByTestId('button-remove-0');

        fireEvent.press(botaoRemover);

        await waitFor(() => {
            expect(queryByTestId('todo-0')).toBeNull();
        });

        expect(getByText('Nenhuma tarefa')).toBeTruthy();
    });
    

    test('deve alternar estado e rótulo do botão toggle', () => {
        expect(getByText('Finalizado')).toBeTruthy();

        const botaoToggle = getByTestId('button-toggle-0');
        fireEvent.press(botaoToggle);

        expect(getByText('Andamento')).toBeTruthy();

        const tarefa = getByTestId('todo-0');
        expect(tarefa.props.style).toContainEqual({ textDecorationLine: 'line-through', color: '#999' });
    });

    test('UNSAFE_getAllByType lista touchables corretamente', () => {
        const touchables = UNSAFE_getAllByType(TouchableOpacity);
        expect(touchables.length).toBeGreaterThanOrEqual(4);
    });

    test('Deve não adicionar um element quando o texto for vazio',()=>{
        const botaoAdicionar = getByTestId('button-add');
        fireEvent.press(botaoAdicionar)
        expect(queryByTestId('todo-1')).toBeNull()
    })

    test("Deve habilitar o modo de edição e preencher o texto da tarefa", () => {
        const botaoEditar = getByTestId('button-edit-0');
        fireEvent.press(botaoEditar);
        const inputEditar = getByTestId("input-edit-0")
        expect(inputEditar.props.value).toBe("Tarefa 1")
        fireEvent.changeText(inputEditar,"Tarefa Editada")
        const botaoSalvarEdicao = getByTestId("button-save-0")
        fireEvent.press(botaoSalvarEdicao)
        const tarefaEditada = queryByText("Tarefa Editada")
        expect(tarefaEditada).toBeTruthy()
    });

    test("Deve usar string vazia como fallback ao iniciar edição com texto vazio", () => {
        ({
            getByTestId,
            getByText,
            queryByText,
            getAllByText,
            queryByTestId,
            UNSAFE_getAllByType,
        } = render(<TodoList initialTodos={[{ text: undefined, done: false }]} />));

        const botaoEditar = getByTestId('button-edit-0');
        fireEvent.press(botaoEditar);

        const inputEditar = getByTestId('input-edit-0');
        expect(inputEditar.props.value).toBe('');
    });

    test("Deve ignorar a edição se o texto for vazio",()=>{
        const botaoEditar = getByTestId('button-edit-0');
        fireEvent.press(botaoEditar);
        const inputEditar = getByTestId("input-edit-0")
        fireEvent.changeText(inputEditar,"")
        const botaoSalvarEdicao = getByTestId("button-save-0")
        fireEvent.press(botaoSalvarEdicao)
        expect(getByText("Tarefa 1")).toBeTruthy()
        expect(queryByText("Tarefa Editada")).toBeNull()
    })

    test("Deve exibir 'Nenhuma tarefa quando não houver tarefas'",()=>{
        ({
            getByTestId,
            getByText,
            queryByText,
            getAllByText,
            queryByTestId,
            UNSAFE_getAllByType,
        } = render(<TodoList initialTodos={[]} />));

        const componenteEmpty = queryByTestId("empty")

        expect(componenteEmpty).toBeTruthy()
    })

    test("Deve deixar um vetor vazio com default caso não seja fornencido uma props incial",()=>{
          ({
            getByTestId,
            getByText,
            queryByText,
            getAllByText,
            queryByTestId,
            UNSAFE_getAllByType,
        } = render(<TodoList initialTodos={undefined} />));

        const componenteEmpty = queryByTestId("empty")

        expect(componenteEmpty).toBeTruthy()
    })


    test("Deve manter o estado da tarefa, caso o index informado seja inválido",()=>{
        const tarefaAntes = getByTestId('todo-0');
        const estadoAntes = tarefaAntes.props.style;
        
        const botaoToggle = getByTestId('button-toggle-0');
        fireEvent.press(botaoToggle);
        
        const tarefaDepois = getByTestId('todo-0');
        expect(tarefaDepois.props.style).not.toEqual(estadoAntes);
        
        fireEvent.press(botaoToggle);
        const tarefaFinal = getByTestId('todo-0');
        expect(tarefaFinal.props.style).toEqual(estadoAntes);
    })

   
    test("Deve preservar outras tarefas ao alternar uma específica", () => {
        const inputNovaTarefa = getByTestId('input-new');
        const botaoAdicionar = getByTestId('button-add');

        fireEvent.changeText(inputNovaTarefa, 'Tarefa 2');
        fireEvent.press(botaoAdicionar);
        fireEvent.changeText(inputNovaTarefa, 'Tarefa 3');
        fireEvent.press(botaoAdicionar);

        const tarefa1Antes = getByTestId('todo-1');
        const done1Antes = tarefa1Antes.props.done;
        const tarefa2Antes = getByTestId('todo-2');
        const done2Antes = tarefa2Antes.props.done;

        const botaoToggle = getByTestId('button-toggle-0');
        fireEvent.press(botaoToggle);

        const tarefa1Depois = getByTestId('todo-1');
        const tarefa2Depois = getByTestId('todo-2');
        
        expect(tarefa1Depois.props.done).toBe(done1Antes);
        expect(tarefa2Depois.props.done).toBe(done2Antes);
    });


    test("Deve preservar outras tarefas ao editar uma específica", () => {
        const inputNovaTarefa = getByTestId('input-new');
        const botaoAdicionar = getByTestId('button-add');

        fireEvent.changeText(inputNovaTarefa, 'Tarefa 2');
        fireEvent.press(botaoAdicionar);
        fireEvent.changeText(inputNovaTarefa, 'Tarefa 3');
        fireEvent.press(botaoAdicionar);

        const tarefa1Antes = getByTestId('todo-1');
        const text1Antes = tarefa1Antes.props.children;
        const tarefa2Antes = getByTestId('todo-2');
        const text2Antes = tarefa2Antes.props.children;
        expect(text1Antes).toBe("Tarefa 2");
        expect(text2Antes).toBe("Tarefa 3");

        const botaoEditar = getByTestId('button-edit-0');
        fireEvent.press(botaoEditar);
        const inputEditar = getByTestId("input-edit-0")
        fireEvent.changeText(inputEditar,"Tarefa Editada")
        const botaoSalvarEdicao = getByTestId("button-save-0")
        fireEvent.press(botaoSalvarEdicao)

        const tarefa1Depois = getByTestId('todo-1');
        const tarefa2Depois = getByTestId('todo-2');
        
        expect(tarefa1Depois.props.children).toBe(text1Antes);
        expect(tarefa2Depois.props.children).toBe(text2Antes);
    })

});