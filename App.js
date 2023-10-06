import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Header, ListItem, Dialog, Button, CheckBox, Tab } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  updateDoc,
  GeoPoint,
  doc,
} from "firebase/firestore";
import firebaseApp from "./firebase";
import * as Location from "expo-location";

const db = getFirestore(firebaseApp);

// status: ROTA , ATRASADO , ENTREGUE , NAORECEBIDO

export default function App() {
  const [listaEntrega, setListaEntrega] = useState([]);
  const [statusSelecionado, setStatus] = useState(0);
  const [exibeDialogo, setExibe] = useState(false);
  const [entregue, setEntregue] = useState(false);
  const [permissao, setPermissao] = useState(false);
  const [localizacao, setLocation] = useState(null);
  const [selecionado, setSelecionado] = useState(null);

  const status = ["ROTA", "ATRASADO", "ENTREGUE", "NAORECEBIDO"];

  async function telaConfirmar() {
    console.log("tela");
    setExibe(true);
    let geo = await Location.getCurrentPositionAsync();
    console.log(geo);
    setLocation(geo);

    await updateDoc(doc(db, "entregas", selecionado), {
      location: new GeoPoint(geo.coords.latitude, geo.coords.longitude),
    });
  }

  function tirarFoto() {
    console.log("foto");
  }

  async function lerDados(sel) {
    listaEntrega.length = 0;
    const q = query(
      collection(db, "entregas"),
      where("status", "==", status[sel])
    );
    const retorno = await getDocs(q);
    retorno.forEach((item) => {
      let dados = item.data();
      dados.exibe = false;
      listaEntrega.push(dados);

      setListaEntrega([...listaEntrega]);
    });
  }
  useEffect(() => {
    lerDados(0);

    async function permissao() {
      const geolocation = await location.getBackgroundPermissionAsync();
      if (geolocation.status == "granted") {
        setPermissao(true);
      }
    }

    permissao();
  }, []);

  return (
    <SafeAreaProvider>
      <Header
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{
          text: "Nicolas Fonseca",
          style: css.header,
        }}
      />

      <Tab
        value={statusSelecionado}
        onChange={(valor) => {
          setStatus(valor);
          lerDados(valor);
        }}
        dense
      >
        <Tab.Item>Rota</Tab.Item>
        <Tab.Item>Entregue</Tab.Item>
        <Tab.Item>Atrasado</Tab.Item>
        <Tab.Item>Não Recebido</Tab.Item>
      </Tab>
      {listaEntrega.map((item, idx) => {
        return (
          <ListItem.Accordion
            key={idx}
            content={
              <>
                <ListItem.Content>
                  <ListItem.Title>OS: {item.ordem_servico}</ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={item.exibe}
            onPress={() => {
              listaEntrega[idx].exibe = !listaEntrega[idx].exibe;
              setSelecionado(item.ordem_servico);

              setListaEntrega([...listaEntrega]);
            }}
          >
            <View style={css.detalheEntrega}>
              <Text>Cliente: {item.cliente}</Text>
              <Text>Endereço: {item.endereco}</Text>
              <Text>Nota Fiscal: {item.nota_fiscal}</Text>
              <Text>Produto: {item.produto}</Text>

              <Button
                title="Confirmar Entrega"
                onPress={telaConfirmar}
                style={css.btnConfirmarEntrega}
              />
            </View>
          </ListItem.Accordion>
        );
      })}
      <Dialog isVisible={exibeDialogo}>
        <Dialog.Title title="Confirmar a entrega" />
        <CheckBox
          title="Entregue"
          checked={entregue === true}
          onPress={() => setEntregue(true)}
        />
        <CheckBox
          title="Não Entregue"
          checked={entregue === false}
          onPress={() => setEntregue(false)}
        />

        <Button title="Tirar Foto" onPress={tirarFoto} />
        <Dialog.Actions>
          <Dialog.Button title="Confirmar" />
          <Dialog.Button title="Cancelar" onPress={() => setExibe(false)} />
        </Dialog.Actions>
      </Dialog>
    </SafeAreaProvider>
  );
}

const css = StyleSheet.create({
  header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    paddingTop: 4,
  },
  detalheEntrega: {
    padding: 8,
  },
  btnConfirmarEntrega: {
    marginTop: 20,
  },
});
