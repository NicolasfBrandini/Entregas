import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Header, Icon, ListItem, Button } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";

// status: ROTA , ATRASADO , ENTREGUE , NAORECEBIDO

const listagem = [
  {
    ordem_servico: "1234",
    clinte: "Nicolas",
    endereco: "Rua das Flores, 123",
    status: "ROTA",
    produto: "caneca",
    nota_fiscal: 1231,
    exibe: false,
  },
  {
    ordem_servico: "12436",
    clinte: "sasa",
    endereco: "Rua das Flores, 123",
    status: "ATRASADO",
    produto: "caneca",
    nota_fiscal: 12345,
    exibe: false,
  },
  {
    ordem_servico: "8634",
    clinte: "Nicolas",
    endereco: "Rua das Flores, 123",
    status: "ENTREGUE",
    produto: "caneca",
    nota_fiscal: 4123,
    exibe: false,
  },
];

export default function App() {
  const [listaEntrega, setListaEntrega] = useState(listagem);

  function telaConfirmar() {
    console.log("tela");
  }

  return (
    <SafeAreaProvider>
      <Header
        leftComponent={{ icon: "menu", color: "#fff" }}
        centerComponent={{
          text: "Nicolas Fonseca",
          style: css.header,
        }}
      />
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

              setListaEntrega([...listaEntrega]);
            }}
          >
            <View style={css.detalheEntrega}>
              <Text>Cliente: {item.clinte}</Text>
              <Text>Endereço: {item.endereco}</Text>
              <Text>Nota Fiscal: {item.nota_fiscal}</Text>
              <Text>Produto: {item.produto}</Text>

              <Button
                title="Confirmar Entrega"
                onPress={telaConfirmar}
                style={css.btnConfirmar}
              />
            </View>
          </ListItem.Accordion>
        );
      })}
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
  btnConfirmar: {
    marginTop: 20,
  },
});
