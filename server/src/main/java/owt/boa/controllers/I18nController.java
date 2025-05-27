package owt.boa.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import owt.boa.models.Message;
import owt.boa.repositories.MessageRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/i18n")
public class I18nController {

    private MessageRepository messageRepository;

    public I18nController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/{lang}")
    public ResponseEntity<Map<String, String>> getTranslations(@PathVariable String lang) {
        List<Message> messages = this.messageRepository.findAll();
        if ("en".equals(lang)) {
            return ResponseEntity.ok(messages.stream()
                    .collect(Collectors.toMap(
                            Message::getCode,
                            Message::getEn,
                            (existing, replacement) -> existing
                    )));
        }
        if ("fr".equals(lang)) {
            return ResponseEntity.ok(messages.stream()
                    .collect(Collectors.toMap(
                            Message::getCode,
                            Message::getFr,
                            (existing, replacement) -> existing
                    )));
        }
        return  null;
    }

}
